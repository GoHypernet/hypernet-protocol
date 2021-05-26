/**
 * The purpose of this test contract is to test the functions in SmartAccount.sol
 * that use endorsements.
 */

var SmartAccount = artifacts.require("SmartAccount");

contract("SmartAccount", function (accounts) {
  var smartAccount,
    owner,
    endorser,
    thirdparty,
    attributeHash1,
    attributeHash2,
    attributeHash3,
    endorsementHash,
    endorsementHash2;

  before(
    "Setup the Smart Account contract and hydrate the required variables",
    function (done) {
      owner = accounts[0];
      endorser = accounts[1];
      thirdparty = accounts[2];

      SmartAccount.new({ from: owner }).then(function (response) {
        smartAccount = response;
        done();
      });

      return smartAccount, owner, endorser, thirdparty;
    },
  );

  attributeHash1 =
    "0xca02b2202ffaacbd499438ef6d594a48f7a7631b60405ec8f30a0d7c096d54d5";
  attributeHash2 =
    "0xca02b2202ffaacbd499438ef6d594a48f7a7631b60405ec8f30a0d7c096dc3ff";
  attributeHash3 =
    "0xca02b2202ffaacbd499438ef6d594a48f7a7631b60405ec8f30a0d7c096cn8sh";
  endorsementHash =
    "0xca02b2202ffaacbd499438ef6d594a48f7a7631b60405ec8f30a0d7c096d54d5";
  endorsementHash2 =
    "0xca02b2202ffaacbd499438ef6d594a48f7a7631b60405ec8f30a0d7c096d59ab";

  describe("Endorsement tests", function () {
    it("will add an attribute for testing purposes", function () {
      return smartAccount
        .addAttribute(attributeHash1, { from: owner })
        .then(function (response) {
          assert.isOk(response, "Attribute addition failed");
          var addAttributeStatus = response.logs[0].args.status;
          assert.equal(
            4,
            addAttributeStatus,
            "Transaction returned unexpected status",
          );
        });
    });

    it("will confirm that the owner's attribute was added successfully", function () {
      return smartAccount.attributes
        .call(attributeHash1)
        .then(function (response) {
          assert.equal(
            response.valueOf(),
            attributeHash1,
            "Attribute hash doesn't exist",
          );
        });
    });

    it("will add an endorsement from an endorser", function () {
      return smartAccount
        .addEndorsement(attributeHash1, endorsementHash, { from: endorser })
        .then(function (response) {
          var addEndorsementStatus = response.logs[0].args.status;
          assert.equal(
            4,
            addEndorsementStatus,
            "Transaction returned unexpected status",
          );
          assert.isOk(response, "Endorsement addition failed");
        });
    });

    it("will accept the endorsement as the owner", function () {
      return smartAccount
        .acceptEndorsement(attributeHash1, endorsementHash, { from: owner })
        .then(function (response) {
          var acceptEndorsementStatus = response.logs[0].args.status;
          assert.equal(
            3,
            acceptEndorsementStatus,
            "Transaction returned unexpected status",
          );
          assert.isOk(response, "Endorsement was not accepted");
        });
    });

    it("will confirm that the endorsement has been added successfully", function () {
      return smartAccount.checkEndorsementExists
        .call(attributeHash1, endorsementHash, { from: endorser })
        .then(function (response) {
          assert.equal(response.valueOf(), true, "Endorsement doesn't exist");
        });
    });

    it("will attempt to remove an endorsement as the owner (fail)", function () {
      return smartAccount.removeEndorsement
        .call(attributeHash1, endorsementHash, { from: owner })
        .catch(function (error) {
          assert.isOk(error, "Expected error has not been caught");
        });
    });

    it("will attempt to remove an endorsement as a third party (fail)", function () {
      return smartAccount.removeEndorsement
        .call(attributeHash1, endorsementHash, { from: thirdparty })
        .catch(function (error) {
          assert.isOk(error, "Expected error has not been caught");
        });
    });

    it("will confirm that the endorsement has not been removed by the third party", function () {
      return smartAccount.checkEndorsementExists
        .call(attributeHash1, endorsementHash, { from: endorser })
        .then(function (response) {
          assert.equal(response.valueOf(), true, "Endorsement doesn't exist");
        });
    });

    it("will remove the endorsement as the endorser", function () {
      return smartAccount
        .removeEndorsement(attributeHash1, endorsementHash, { from: endorser })
        .then(function (response) {
          var removeEndorsementStatus = response.logs[0].args.status;
          assert.equal(
            3,
            removeEndorsementStatus,
            "Transaction returned unexpected status",
          );
          assert.isOk(response, "Endorsement was not accepted");
        });
    });

    it("will confirm that the endorsement has been removed successfully", function () {
      return smartAccount.checkEndorsementExists
        .call(attributeHash1, endorsementHash, { from: endorser })
        .then(function (response) {
          assert.equal(
            response.valueOf(),
            false,
            "Endorsement still present despite removal",
          );
        });
    });

    it("will confirm that an endorsement is invalid if an attribute is removed", function () {
      return smartAccount
        .addAttribute(attributeHash2, { from: owner })
        .then(function (response) {
          assert.isOk(response, "Attribute was not added successfully");
          return smartAccount.addEndorsement(attributeHash2, endorsementHash, {
            from: endorser,
          });
        })
        .then(function (response) {
          assert.isOk(response, "Endorsement was not added successfully");
          return smartAccount.removeAttribute(attributeHash2, { from: owner });
        })
        .then(function (response) {
          assert.isOk(response, "Attribute was not removed successfully");
          return smartAccount.checkEndorsementExists.call(
            attributeHash2,
            endorsementHash,
            { from: endorser },
          );
        })
        .then(function (response) {
          assert.equal(response, false, "Endorsement still exists");
        });
    });

    it("will make sure that an endorser can delete an endorsement after an attribute has been removed", function () {
      return smartAccount
        .addAttribute(web3.sha3("testhash"), { from: owner })
        .then(function (response) {
          assert.isOk(response, "Attribute was not added successfully");
          return smartAccount.addEndorsement(
            web3.sha3("testhash"),
            web3.sha3("testendorsement"),
            { from: endorser },
          );
        })
        .then(function (response) {
          assert.isOk(response, "Endorsement was not added successfully");
          return smartAccount.removeAttribute(web3.sha3("testhash"), {
            from: owner,
          });
        })
        .then(function (response) {
          assert.isOk(response, "Attribute was not removed successfully");
          return smartAccount.removeEndorsement(
            web3.sha3("testhash"),
            web3.sha3("testendorsement"),
            { from: endorser },
          );
        })
        .then(function (response) {
          assert.isOk(response, "Endorsement not removed successfully");
        });
    });

    it("will make sure that an endorser cannot add an endorsement to a non-existent attribute", function () {
      return smartAccount
        .addEndorsement(
          web3.sha3("non-existent attribute"),
          web3.sha3("new endorsement"),
          { from: endorser },
        )
        .catch(function (error) {
          assert.isOk(
            error,
            "Endorsement was added for a non-existent attribute",
          );
        });
    });

    it("will add an endorsement from the endorser for testing purposes", function () {
      return smartAccount
        .addEndorsement(attributeHash1, endorsementHash2, { from: endorser })
        .then(function (response) {
          var addEndorsementStatus = response.logs[0].args.status;
          assert.equal(
            4,
            addEndorsementStatus,
            "Transaction returned unexpected status",
          );
          assert.isOk(response, "Endorsement was not added");
        });
    });

    it("will remove the endorsement as the owner", function () {
      return smartAccount
        .removeEndorsement(attributeHash1, endorsementHash2, { from: owner })
        .then(function (response) {
          var removeEndorsementStatus = response.logs[0].args.status;
          assert.equal(
            3,
            removeEndorsementStatus,
            "Transaction returned unexpected status",
          );
          assert.isOk(response, "Endorsement not removed");
        });
    });
  });
});
