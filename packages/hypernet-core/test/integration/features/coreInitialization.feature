Feature: Core Initializing
    Tests if user is being initialized correctly with the Core

    Scenario: Core can get user connected ethereum accounts and intialize user core instance with publicIdentifier
        Given coreUserA has an instance of the core
        When coreUserA initializes the protocol with one of his accounts
        Then coreUserA ether account is now associated with HypernetCore instance and coreUserA publicIdentifier is initiated