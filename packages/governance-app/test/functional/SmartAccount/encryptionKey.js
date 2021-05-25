/**
  * The purpose of this test contract is to test the functions in SmartAccount.sol
  * that alter the encryption public key.
  */

var SmartAccount = artifacts.require("SmartAccount");

contract('SmartAccount', function(accounts) {

    var smartAccount,
        owner,
        thirdparty,
        publicEncryptionKey,
        newPublicEncryptionKey;

    before("Setup the Smart Account contract and hydrate the required variables", function(done) {
        owner = accounts[0];
        thirdparty = accounts[1];

        SmartAccount.new({from: owner})
        .then(function(response) {
            smartAccount = response;
            done();
        });

        return smartAccount,
        owner,
        thirdparty;
    });

    publicEncryptionKey = "Example Public Key 1";
    newPublicEncryptionKey = "Example Public Key 2";

    describe("Encryption Public Key tests", function() {

        it("will set encryption public key as the owner", function() {
            return smartAccount.setEncryptionPublicKey(publicEncryptionKey, {from: owner})
            .then(function(response) {
                var newEncryptKeyStatus = response.logs[0].args.status;
                assert.equal(3, newEncryptKeyStatus, "Transaction returned unexpected status");
                assert.isOk(response, "Attribute addition failed");
            });
        });

        it("will confirm that the owner's encryption public key was set successfully", function() {
            return smartAccount.encryptionPublicKey.call({from: owner})
            .then(function(response) {
                assert.equal(response, publicEncryptionKey, "encryptionPublicKey doesn't exist");
            });
        });

        it("will update the encryption public key as the owner", function() {
            return smartAccount.setEncryptionPublicKey(newPublicEncryptionKey, {from: owner})
            .then(function(response) {
                var newEncryptKeyStatus = response.logs[0].args.status;
                assert.equal(3, newEncryptKeyStatus, "Transaction returned unexpected status");
                assert.isOk(response, "Attribute addition failed");
            });
        });

        it("will confirm that the owner's encryption public key has been changed", function() {
            return smartAccount.encryptionPublicKey.call({from: owner})
            .then(function(response) {
                assert.equal(response, newPublicEncryptionKey, "encryptionPublicKey has not been changed");
            });
        });

        it("will not allow a third party to modify the owner's encryption public key", function() {
            return smartAccount.setEncryptionPublicKey(publicEncryptionKey, {from: thirdparty})
            .catch(function(error) {
                assert.isOk(error, 'Expected error has not been caught');
            });
        });

        it("will confirm that the owner's encryption public key has not been changed by the third party", function() {
            return smartAccount.encryptionPublicKey.call({from: owner})
            .then(function(response) {
                assert.equal(response, newPublicEncryptionKey, "encryptionPublicKey has been changed");
            });
        });

        it("will allow a third party to read the owner's encryption public key", function() {
            return smartAccount.encryptionPublicKey.call({from: thirdparty})
            .then(function(response) {
                assert.equal(response, newPublicEncryptionKey, "encryptionPublicKey has not been changed");
            });
        });

    });
});
