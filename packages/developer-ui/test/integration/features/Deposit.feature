Feature: Deposit
    Tests if user is able to deposit his HNP account with specific amount of ETH and HNT

    Scenario: DepositUserA can deposit ether asset into his HNP account
        Given DepositUserA has a registered ethereum account using a mnemonic
        When DepositUserA visits developer ui
        When DepositUserA deposit '1' amount of ETH from his ETH account to HNP account
        When DepositUserA deposit '1' amount of HNT from his ETH account to HNP account
        Then DepositUserA HNP balance increases by '1' ETH and '1' HNT amount calculated in wei