Feature: GatewayAuthorization
  Tests if user is able to authorize a gateway

  Scenario: GatewayUserA can authorize a gateway
    Given GatewayUserA has hypernet account and has the developer UI opened
    When GatewayUserA authorize gateway url of 'http://localhost:5010'
    Then GatewayUserA has gateway of 'http://localhost:5010' authorized