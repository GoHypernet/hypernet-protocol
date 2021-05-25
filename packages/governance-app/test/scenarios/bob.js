/**
  * Bob has a current account with his bank, but wants to apply for a mortgage.
  *
  * The mortgage department need additional information from Bob to prove he’s employed.
  * Bob’s employer has endorsed his Smart Account.
  * This has been shared with the bank, who can verify his employment status - now and on an ongoing basis.
  *
  */

var SmartAccount = artifacts.require("SmartAccount");

contract('SmartAccount', function(accounts) {

    var bob = {},
        employer = {},
        bank = {},
        employmentAttributeHash,
        endorsementHash;

    before("Setup the scenario", function() {
        bob.address = accounts[0];
        employer.address = accounts[1];
        bank.address = accounts[2];

        employmentAttributeHash = '0xca02b2202ffaacbd499438ef6d594a48f7a7631b60405ec8f30a0d7c096dc3ff';
        endorsementHash = '0xca02b2202ffaacbd499438ef6d594a48f7a7631b60405ec8f30a0d7c096d54d5';

        return bob,
        employer,
        bank,
        employmentAttributeHash,
        endorsementHash;

    });

    describe("Scenario: Bob has a current account with his bank, but needs to supply additional information to apply for a mortgage.", function() {

        it("Should create an account for Bob so that he can create employement status attributes", function() {
          var encryptionKey = "test encryption key";

            return SmartAccount.new({from: bob.address})
            .then(function(data) {
                bob.account = data.address;
                assert.isOk(data, "Bob's Account failed to be created");
                return data.setEncryptionPublicKey(encryptionKey, {from: bob.address})
            }).then(function() {
                SmartAccount.at(bob.account).then(function(account){
                    return account.encryptionPublicKey.call();
                }).then(function(returnedEncryptionKey) {
                    assert.equal(encryptionKey, returnedEncryptionKey, "failed to add key");
                })
            })
        });

        it("Should create an account for Bob's Employer so they can endorse his employment status", function() {
            return SmartAccount.new({from: employer.address})
            .then(function(data) {
                employer.account = data.address;
                assert.isOk(data, "Bob's Employer Account failed to be created");
            });
        });

        it("Should create an account for Bob's Bank so they can verify the employment status", function() {
            return SmartAccount.new({from: bank.address})
            .then(function(data) {
                bank.account = data.address;
                assert.isOk(data, "Bob's Bank Account failed to be created");
            });
        });

        it("Should allow Bob to create a new employment status attribute", function() {
            return SmartAccount.at(bob.account).addAttribute(employmentAttributeHash, {from: bob.address})
            .then(function(data) {
                assert.isOk(data, 'Employment status attribute failed to be created');
            });
        });

        it("Should allow Bob's Employer to endorse Bob's employment status", function() {
            return SmartAccount.at(bob.account).addEndorsement(employmentAttributeHash, endorsementHash, {from: employer.address})
            .then(function(data) {
                assert.isOk(data, "Bob's employment status failed to be endorsed");
            });
        });

        it("Should allow Bob to accept his Employer's endorsement for his employment status", function() {
            return SmartAccount.at(bob.account).acceptEndorsement(employmentAttributeHash, endorsementHash, {from: bob.address})
            .then(function(data) {
                assert.isOk(data, "Bob failed to accept the employment endorsement");
            });
        });

        it("Should allow Bob's Bank to check that an endorsement exists for his attribute; verifying his employement status", function() {
            return SmartAccount.at(bob.account).checkEndorsementExists.call(employmentAttributeHash, endorsementHash, {from: bank.address})
            .then(function(data) {
                assert.equal(data.valueOf(), true, "Bank failed to find endorsements for Bob's employment status");
            });
        });

    });
});
