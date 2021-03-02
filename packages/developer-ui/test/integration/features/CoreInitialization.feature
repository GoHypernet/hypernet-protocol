Feature: Core Initializing
    Tests if user is being initialized correctly with the Core

    Scenario: Core can get user connected ethereum accounts and intialize user core instance with publicIdentifier
        Given userA has registered mnemonic in hypernet protocol
        When userA visits developer ui web page
        Then userA ether account is now associated with HypernetCore instance and publicIdentifier is initiated