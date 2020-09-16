import {expectRevert} from '@statechannels/devtools';
import {Contract, BigNumber, utils} from 'ethers';

// @ts-ignore
import AssetHolderArtifact from '../../../build/contracts/TESTAssetHolder.json';
import {claimAllArgs} from '../../../src/contract/transaction-creators/asset-holder';
import {
  allocationToParams,
  AssetOutcomeShortHand,
  assetTransferredEventsFromPayouts,
  compileEventsFromLogs,
  getTestProvider,
  guaranteeToParams,
  randomChannelId,
  randomExternalDestination,
  replaceAddressesAndBigNumberify,
  setupContracts,
} from '../../test-helpers';

const provider = getTestProvider();
const addresses = {
  // Channels
  t: undefined, // Target
  g: undefined, // Guarantor
  // Externals
  I: randomExternalDestination(),
  A: randomExternalDestination(),
  B: randomExternalDestination(),
};
let AssetHolder: Contract;

beforeAll(async () => {
  AssetHolder = await setupContracts(
    provider,
    AssetHolderArtifact,
    process.env.TEST_ASSET_HOLDER_ADDRESS
  );
});

const reason5 =
  'claimAll | submitted data does not match assetOutcomeHash stored against targetChannelId';
const reason6 =
  'claimAll | submitted data does not match assetOutcomeHash stored against guarantorChannelId';

// 1. claim G1 (step 1 of figure 23 of nitro paper)
// 2. claim G2 (step 2 of figure 23 of nitro paper)
// 3. claim G1 (step 1 of alternative in figure 23 of nitro paper)
// 4. claim G2 (step 2 of alternative of figure 23 of nitro paper)

// Amounts are valueString representations of wei
describe('claimAll', () => {
  it.each`
    name                                               | heldBefore | guaranteeDestinations | tOutcomeBefore        | tOutcomeAfter   | heldAfter | payouts         | reason
    ${'1. straight-through guarantee, 3 destinations'} | ${{g: 5}}  | ${['I', 'A', 'B']}    | ${{I: 5, A: 5, B: 5}} | ${{A: 5, B: 5}} | ${{g: 0}} | ${{I: 5}}       | ${undefined}
    ${'2. swap guarantee,             2 destinations'} | ${{g: 5}}  | ${['B', 'A']}         | ${{A: 5, B: 5}}       | ${{A: 5}}       | ${{g: 0}} | ${{B: 5}}       | ${undefined}
    ${'3. swap guarantee,             3 destinations'} | ${{g: 5}}  | ${['I', 'B', 'A']}    | ${{I: 5, A: 5, B: 5}} | ${{A: 5, B: 5}} | ${{g: 0}} | ${{I: 5}}       | ${undefined}
    ${'4. straight-through guarantee, 2 destinations'} | ${{g: 5}}  | ${['A', 'B']}         | ${{A: 5, B: 5}}       | ${{B: 5}}       | ${{g: 0}} | ${{A: 5}}       | ${undefined}
    ${'5. allocation not on chain'}                    | ${{g: 5}}  | ${['B', 'A']}         | ${{}}                 | ${{A: 5}}       | ${{g: 0}} | ${{B: 5}}       | ${reason5}
    ${'6. guarantee not on chain'}                     | ${{g: 5}}  | ${[]}                 | ${{A: 5, B: 5}}       | ${{A: 5}}       | ${{g: 0}} | ${{B: 5}}       | ${reason6}
    ${'7. swap guarantee, overfunded, 2 destinations'} | ${{g: 12}} | ${['B', 'A']}         | ${{A: 5, B: 5}}       | ${{}}           | ${{g: 2}} | ${{A: 5, B: 5}} | ${undefined}
    ${'8. underspecified guarantee, overfunded      '} | ${{g: 12}} | ${['B']}              | ${{A: 5, B: 5}}       | ${{}}           | ${{g: 2}} | ${{A: 5, B: 5}} | ${undefined}
  `(
    '$name',
    async ({
      name,
      heldBefore,
      guaranteeDestinations,
      tOutcomeBefore,
      tOutcomeAfter,
      heldAfter,
      payouts,
      reason,
    }: {
      name;
      heldBefore: AssetOutcomeShortHand;
      guaranteeDestinations;
      tOutcomeBefore: AssetOutcomeShortHand;
      tOutcomeAfter: AssetOutcomeShortHand;
      heldAfter: AssetOutcomeShortHand;
      payouts: AssetOutcomeShortHand;
      reason;
    }) => {
      // Compute channelIds
      const tNonce = BigNumber.from(utils.id(name))
        .mask(30)
        .toNumber();
      const gNonce = BigNumber.from(utils.id(name + 'g'))
        .mask(30)
        .toNumber();
      const targetId = randomChannelId(tNonce);
      const guarantorId = randomChannelId(gNonce);
      addresses.t = targetId;
      addresses.g = guarantorId;

      // Transform input data (unpack addresses and BigNumber amounts)
      [heldBefore, tOutcomeBefore, tOutcomeAfter, heldAfter, payouts] = [
        heldBefore,
        tOutcomeBefore,
        tOutcomeAfter,
        heldAfter,
        payouts,
      ].map(object => replaceAddressesAndBigNumberify(object, addresses) as AssetOutcomeShortHand);
      guaranteeDestinations = guaranteeDestinations.map(x => addresses[x]);

      // Set holdings (only works on test contract)
      new Set([...Object.keys(heldAfter), ...Object.keys(heldBefore)]).forEach(async key => {
        // Key must be either in heldBefore or heldAfter or both
        const amount = heldBefore[key] ? heldBefore[key] : BigNumber.from(0);
        await (await AssetHolder.setHoldings(key, amount)).wait();
        expect((await AssetHolder.holdings(key)).eq(amount)).toBe(true);
      });

      // Compute an appropriate allocation.
      const allocation = [];
      Object.keys(tOutcomeBefore).forEach(key =>
        allocation.push({destination: key, amount: tOutcomeBefore[key]})
      );
      const [, outcomeHash] = allocationToParams(allocation);

      // Set outcomeHash for target
      await (await AssetHolder.setAssetOutcomeHashPermissionless(targetId, outcomeHash)).wait();
      expect(await AssetHolder.assetOutcomeHashes(targetId)).toBe(outcomeHash);

      // Compute an appropriate guarantee

      const guarantee = {
        destinations: guaranteeDestinations,
        targetChannelId: targetId,
      };

      if (guaranteeDestinations.length > 0) {
        const [, gOutcomeContentHash] = guaranteeToParams(guarantee);

        // Set outcomeHash for guarantor
        await (
          await AssetHolder.setAssetOutcomeHashPermissionless(guarantorId, gOutcomeContentHash)
        ).wait();
        expect(await AssetHolder.assetOutcomeHashes(guarantorId)).toBe(gOutcomeContentHash);
      }

      const tx = AssetHolder.claimAll(...claimAllArgs(guarantorId, guarantee, allocation));

      // Call method in a slightly different way if expecting a revert
      if (reason) {
        await expectRevert(() => tx, reason);
      } else {
        // Compile event expectations
        let expectedEvents = [];

        // Add AssetTransferred events to expectations
        Object.keys(payouts).forEach(assetHolder => {
          expectedEvents = assetTransferredEventsFromPayouts(
            guarantorId,
            payouts,
            AssetHolder.address
          );
        });

        // Extract logs
        const {logs} = await (await tx).wait();

        // Compile events from logs
        const events = compileEventsFromLogs(logs, [AssetHolder]);

        // Check that each expectedEvent is contained as a subset of the properies of each *corresponding* event: i.e. the order matters!
        expect(events).toMatchObject(expectedEvents);

        // Check new holdings
        Object.keys(heldAfter).forEach(async key =>
          expect(await AssetHolder.holdings(key)).toEqual(heldAfter[key])
        );

        // Check new outcomeHash
        const allocationAfter = [];
        Object.keys(tOutcomeAfter).forEach(key => {
          allocationAfter.push({destination: key, amount: tOutcomeAfter[key]});
        });
        const [, expectedNewOutcomeHash] = allocationToParams(allocationAfter);
        expect(await AssetHolder.assetOutcomeHashes(targetId)).toEqual(expectedNewOutcomeHash);
      }
    }
  );
});
