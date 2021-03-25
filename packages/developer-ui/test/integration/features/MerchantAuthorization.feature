Feature: MerchantAuthorization
  Tests if user is able to authorize a merchant

  Scenario: MerchantUserA can authorize a merchant
    Given MerchantUserA has hypernet account and has the developer UI opened
    When MerchantUserA authorize merchant url of 'http://localhost:5010'
    Then MerchantUserA has merchant of 'http://localhost:5010' authorized