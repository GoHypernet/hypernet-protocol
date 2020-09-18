"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_1 = require("../bignumber");
const _1 = require(".");
const one = bignumber_1.BN.from(1);
const two = bignumber_1.BN.from(2);
const three = bignumber_1.BN.from(3);
const left = _1.makeDestination('0x0000000000000000000000000000000000000001');
const right = _1.makeDestination('0x0000000000000000000000000000000000000002');
const middle = _1.makeDestination('0x0000000000000000000000000000000000000003');
const targetChannelId = _1.makeDestination('0x1234123412341234123412341234123412341234123412341234123412341234');
describe('allocateToTarget with valid input', () => {
    const target1 = [
        { destination: left, amount: one },
        { destination: right, amount: one }
    ];
    const ledger1 = [...target1];
    const expected1 = [{ destination: targetChannelId, amount: two }];
    const target2 = [
        { destination: left, amount: one },
        { destination: right, amount: two }
    ];
    const ledger2 = [
        { destination: left, amount: three },
        { destination: right, amount: three }
    ];
    const expected2 = [
        { destination: left, amount: two },
        { destination: right, amount: one },
        { destination: targetChannelId, amount: three }
    ];
    const target3 = [
        { destination: left, amount: one },
        { destination: right, amount: two }
    ];
    const ledger3 = [
        { destination: right, amount: three },
        { destination: left, amount: three }
    ];
    const expected3 = [
        { destination: right, amount: one },
        { destination: left, amount: two },
        { destination: targetChannelId, amount: three }
    ];
    const target4 = [
        { destination: left, amount: one },
        { destination: right, amount: two }
    ];
    const ledger4 = [
        { destination: left, amount: three },
        { destination: middle, amount: three },
        { destination: right, amount: three }
    ];
    const expected4 = [
        { destination: left, amount: two },
        { destination: middle, amount: three },
        { destination: right, amount: one },
        { destination: targetChannelId, amount: three }
    ];
    it.each `
    description | deductions | ledgerAllocation | expectedAllocation
    ${'one'}    | ${target1} | ${ledger1}       | ${expected1}
    ${'two'}    | ${target2} | ${ledger2}       | ${expected2}
    ${'three'}  | ${target3} | ${ledger3}       | ${expected3}
    ${'four'}   | ${target4} | ${ledger4}       | ${expected4}
  `('Test $description', ({ deductions, ledgerAllocation, expectedAllocation }) => {
        expect(_1.allocateToTarget(_1.simpleEthAllocation(ledgerAllocation), deductions, targetChannelId)).toMatchObject(_1.simpleEthAllocation(expectedAllocation));
        expect(_1.allocateToTarget(_1.simpleTokenAllocation('foo', ledgerAllocation), deductions, targetChannelId)).toMatchObject(_1.simpleTokenAllocation('foo', expectedAllocation));
    });
});
describe('allocateToTarget with invalid input', () => {
    const target1 = [
        { destination: left, amount: one },
        { destination: middle, amount: one }
    ];
    const ledger1 = [
        { destination: left, amount: one },
        { destination: right, amount: one }
    ];
    const error1 = _1.Errors.DestinationMissing;
    const target2 = [
        { destination: left, amount: three },
        { destination: right, amount: three }
    ];
    const ledger2 = [
        { destination: left, amount: one },
        { destination: right, amount: two }
    ];
    const error2 = _1.Errors.InsufficientFunds;
    it.each `
    description | deductions | ledgerAllocation | error
    ${'one'}    | ${target1} | ${ledger1}       | ${error1}
    ${'two'}    | ${target2} | ${ledger2}       | ${error2}
  `('Test $description', ({ deductions, ledgerAllocation, error }) => {
        expect(() => _1.allocateToTarget(_1.simpleEthAllocation(ledgerAllocation), deductions, targetChannelId)).toThrow(error);
    });
});
//# sourceMappingURL=allocate-to-target.test.js.map