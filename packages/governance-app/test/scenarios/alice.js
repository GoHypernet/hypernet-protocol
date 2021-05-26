/**
 * Alice has a current account with her bank, but wants to open an account for her business.
 *
 * Instead of the retail bank having to transfer confidential documentation to the commercial bank in order to validate
 * Alice’s account, both organisations trust Alice’s Smart Account. In order to pass the commercial bank's KYC checks,
 * Alice simply sends them her digitally-signed documents from the retail bank (through her Smart Account app).
 *
 */

var SmartAccount = artifacts.require("SmartAccount");

contract("SmartAccount", function (accounts) {
  var alice = {},
    retailBank = {},
    commercialBank = {},
    kycAttributeHash,
    endorsementHash;

  before("Setup the scenario", function () {
    alice.address = accounts[0];
    retailBank.address = accounts[1];
    commercialBank.address = accounts[2];

    kycAttributeHash =
      "0xca02b2202ffaacbd499438ef6d594a48f7a7631b60405ec8f30a0d7c096dc3ff";
    endorsementHash =
      "0xca02b2202ffaacbd499438ef6d594a48f7a7631b60405ec8f30a0d7c096d54d5";

    return alice, retailBank, commercialBank, kycAttributeHash, endorsementHash;
  });

  describe("Scenario: Alice has a current account with her bank, but wants to open an account for her business.", function () {
    it("Should create an account for Alice so that she can create KYC attributes", function () {
      var encryptionKey = "test encryption key";
      return SmartAccount.new({ from: alice.address })
        .then(function (data) {
          alice.account = data.address;
          assert.isOk(data, "Alice's Account failed to be created");

          return data.setEncryptionPublicKey(encryptionKey, {
            from: alice.address,
          });
        })
        .then(function () {
          SmartAccount.at(alice.account)
            .then(function (account) {
              return account.encryptionPublicKey.call();
            })
            .then(function (returnedEncryptionKey) {
              assert.equal(
                encryptionKey,
                returnedEncryptionKey,
                "failed to add key",
              );
            });
        });
    });

    it("Should create an account for Alice's Retail Bank so they can endorse her KYC checks", function () {
      return SmartAccount.new({ from: retailBank.address }).then(function (
        data,
      ) {
        retailBank.account = data.address;
        assert.isOk(data, "Alice's Retail Bank Account failed to be created");
      });
    });

    it("Should create an account for Alice's Commercial Bank so they can verify the KYC checks", function () {
      return SmartAccount.new({ from: commercialBank.address }).then(function (
        data,
      ) {
        commercialBank.account = data.address;
        assert.isOk(
          data,
          "Alice's Commercial Bank Account failed to be created",
        );
      });
    });

    it("Should allow Alice to create a new KYC attribute", function () {
      return SmartAccount.at(alice.account)
        .addAttribute(kycAttributeHash, { from: alice.address })
        .then(function (data) {
          assert.isOk(data, "KYC attribute failed to be created");
        });
    });

    it("Should allow Alice's Retail Bank to endorse Alice's KYC attribute", function () {
      return SmartAccount.at(alice.account)
        .addEndorsement(kycAttributeHash, endorsementHash, {
          from: retailBank.address,
        })
        .then(function (data) {
          assert.isOk(data, "Alice's KYC checks failed to be endorsed");
        });
    });

    it("Should allow Alice to accept her Retail Bank's endorsement for her attribute", function () {
      return SmartAccount.at(alice.account)
        .acceptEndorsement(kycAttributeHash, endorsementHash, {
          from: alice.address,
        })
        .then(function (data) {
          assert.isOk(data, "Alice failed to accept the KYC endorsement");
        });
    });

    it("Should allow Alice's Bank to check that an endorsement exists for her KYC attribute; verifying her KYC checks", function () {
      return SmartAccount.at(alice.account)
        .checkEndorsementExists.call(kycAttributeHash, endorsementHash, {
          from: commercialBank.address,
        })
        .then(function (data) {
          assert.equal(
            data.valueOf(),
            true,
            "Bank failed to find endorsements for Alice's KYC checks",
          );
        });
    });
  });
});
