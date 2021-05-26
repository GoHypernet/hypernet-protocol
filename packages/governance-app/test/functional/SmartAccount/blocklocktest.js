/**
 * The purpose of this test contract is to test the blocklock function in
 * SmartAccount.sol.
 */

var SmartAccount = artifacts.require("SmartAccount");

contract(
  "SmartAccount",
  function (accounts) {
    var smartAccount, owner, override, thirdparty;

    before(
      "Setup the Smart Account contract and hydrate the required variables",
      function () {
        owner = accounts[0];
        override = owner;
        thirdparty = accounts[1];

        SmartAccount.new({ from: owner }).then(function (data) {
          smartAccount = data;
        });

        return smartAccount, owner, thirdparty;
      },
    );

    describe("Blocklock tests", function () {
      it("will create a new user and immediately set a new owner successfully", function () {
        return SmartAccount.new({ from: owner })
          .then(function (account) {
            return account.setOwner(thirdparty, { from: override });
          })
          .then(function (response) {
            var newOwnerStatus = response.logs[0].args.status;
            assert.equal(
              3,
              newOwnerStatus,
              "Transaction returned unexpected status",
            );
            assert.isOk(response, "Setting new owner failed");
          });
      });

      it("will set thirdparty as the new owner by an override user", function () {
        return smartAccount
          .setOwner(thirdparty, { from: override })
          .then(function (response) {
            var newOwnerStatus = response.logs[0].args.status;
            assert.equal(
              3,
              newOwnerStatus,
              "Transaction returned unexpected status",
            );
            assert.isOk(response, "Setting new owner failed");
          });
      });

      it("will invoke the blocklock function when repeatedly setting a new owner as an override user", function () {
        return smartAccount
          .setOwner(thirdparty, { from: override })
          .then(function () {
            assert.isOk(error, "Expected error has not been thrown");
          })
          .catch(function (error) {
            assert.isOk(error, "Expected error has not been caught");
          });
      });

      it("will mine through 20 blocks to simulate the blocklock time passing");
      for (var i = 1; i < 21; i++) {
        it("BLOCK MINING " + i, function () {
          return SmartAccount.new();
        });
      }

      it("will set the override to a thirdparty owner", function () {
        return smartAccount
          .setOverride(accounts[3], { from: thirdparty })
          .then(function (response) {
            var newOverrideStatus = response.logs[0].args.status;
            assert.equal(
              3,
              newOverrideStatus,
              "Transaction returned unexpected status",
            );
            assert.isOk(response, "Setting override failed");
          });
      });

      it("will invoke the blocklock function when repeatedly setting a new owner as an override user", function () {
        smartAccount
          .setOwner(thirdparty, { from: override })
          .catch(function (error) {
            assert.isOk(error, "Expected error has not been caught");
          });
      });

      it(
        "will once again mine through 20 blocks to simulate the blocklock time passing",
      );
      for (var j = 1; j < 21; j++) {
        it("BLOCK MINING " + j, function () {
          return SmartAccount.new();
        });
      }

      it("will set the new owner back to 'owner' as the new override user", function (done) {
        smartAccount
          .setOwner(owner, { from: accounts[3] })
          .then(function (response) {
            var newOwnerStatus = response.logs[0].args.status;
            assert.equal(
              3,
              newOwnerStatus,
              "Transaction returned unexpected status",
            );
            assert.isOk(response, "Setting new owner failed");
            done();
          });
      });

      it("will invoke the blocklock function when repeatedly setting a new owner as an override user", function (done) {
        smartAccount
          .setOwner(thirdparty, { from: override })
          .catch(function (error) {
            assert.isOk(error, "Expected error has not been caught");
            done();
          });
      });
    });
  },
  5000,
);
