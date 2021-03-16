Feature: Core Initializing
    Tests if user is being initialized correctly with the Core

    Scenario: Core can get user connected ethereum accounts and intialize user core instance with publicIdentifier
        Given CoreUserA has a registered ETH account using a mnemonic
        When CoreUserA visits developer ui
        Then CoreUserA ether account is now associated with HypernetCore instance and publicIdentifier is initiated