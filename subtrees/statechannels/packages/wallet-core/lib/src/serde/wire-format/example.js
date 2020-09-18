"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_1 = require("../../bignumber");
const utils_1 = require("../../utils");
const state_utils_1 = require("../../state-utils");
exports.wireStateFormat = {
    participants: [
        {
            destination: '0x00000000000000000000000063E3FB11830c01ac7C9C64091c14Bb6CbAaC9Ac7',
            participantId: '0x11115FAf6f1BF263e81956F0Cc68aEc8426607cf',
            signingAddress: '0x11115FAf6f1BF263e81956F0Cc68aEc8426607cf'
        },
        {
            destination: '0x00000000000000000000000063E3FB11830c01ac7C9C64091c14Bb6CbAaC9Ac7',
            participantId: '0x2222E21c8019b14dA16235319D34b5Dd83E644A9',
            signingAddress: '0x2222E21c8019b14dA16235319D34b5Dd83E644A9'
        }
    ],
    appData: '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016345785d8a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004444444444444444444444444444444444444444444444444444444444444444',
    appDefinition: '0x430869383d611bBB1ce7Ca207024E7901bC26b40',
    challengeDuration: 1184,
    channelId: '0xb08bc94ebfbe1b23c419bec2d57993d33c41b112fbbca5d51f0f18194baadcf1',
    chainId: '0x2329',
    channelNonce: 123,
    isFinal: false,
    outcome: [
        {
            allocationItems: [
                {
                    amount: '0x00000000000000000000000000000000000000000000000006f05b59d3b20000',
                    destination: '0x00000000000000000000000063e3fb11830c01ac7c9c64091c14bb6cbaac9ac7'
                },
                {
                    amount: '0x00000000000000000000000000000000000000000000000006f05b59d3b20000',
                    destination: '0x00000000000000000000000063e3fb11830c01ac7c9c64091c14bb6cbaac9ac7'
                }
            ],
            assetHolderAddress: '0x4ad3F07BEFDC54511449A1f553E36A653c82eA57'
        }
    ],
    turnNum: 1,
    signatures: [
        '0xef7e226a43c52d4b8f7b14f13acdf9e75d871ea5c51235fbc4d538acf84c61c4727431f0cc83d0f566e222a21d35ae4d8d2a0dd4428cba7bf95bf7b3f11ad0c61c'
    ]
};
const wireStateFormat2 = Object.assign(Object.assign({}, exports.wireStateFormat), { channelNonce: 124, channelId: '0x583e42e295214b60ad730c15547584c11edb05032d92e4c781ad61d0c193a5fb', outcome: [
        {
            assetHolderAddress: '0x4ad3F07BEFDC54511449A1f553E36A653c82eA57',
            destinations: ['0x00000000000000000000000063E3FB11830c01ac7C9C64091c14Bb6CbAaC9Ac7'],
            targetChannelId: '0xb08bc94ebfbe1b23c419bec2d57993d33c41b112fbbca5d51f0f18194baadcf1'
        }
    ], signatures: [] });
exports.internalStateFormat = {
    participants: [
        {
            destination: utils_1.makeDestination('0x63E3FB11830c01ac7C9C64091c14Bb6CbAaC9Ac7'),
            participantId: '0x11115FAf6f1BF263e81956F0Cc68aEc8426607cf',
            signingAddress: '0x11115FAf6f1BF263e81956F0Cc68aEc8426607cf'
        },
        {
            destination: utils_1.makeDestination('0x63E3FB11830c01ac7C9C64091c14Bb6CbAaC9Ac7'),
            participantId: '0x2222E21c8019b14dA16235319D34b5Dd83E644A9',
            signingAddress: '0x2222E21c8019b14dA16235319D34b5Dd83E644A9'
        }
    ],
    appData: '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016345785d8a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004444444444444444444444444444444444444444444444444444444444444444',
    appDefinition: '0x430869383d611bBB1ce7Ca207024E7901bC26b40',
    challengeDuration: 0x00000000000000000000000000000000000000000000000000000000000004a0,
    chainId: '0x2329',
    channelNonce: 123,
    isFinal: false,
    outcome: {
        type: 'SimpleAllocation',
        assetHolderAddress: '0x4ad3F07BEFDC54511449A1f553E36A653c82eA57',
        allocationItems: [
            {
                amount: bignumber_1.BN.from('0x00000000000000000000000000000000000000000000000006f05b59d3b20000'),
                destination: utils_1.makeDestination('0x00000000000000000000000063e3fb11830c01ac7c9c64091c14bb6cbaac9ac7')
            },
            {
                amount: bignumber_1.BN.from('0x00000000000000000000000000000000000000000000000006f05b59d3b20000'),
                destination: utils_1.makeDestination('0x00000000000000000000000063e3fb11830c01ac7c9c64091c14bb6cbaac9ac7')
            }
        ]
    },
    turnNum: 1,
    signatures: [
        {
            signature: '0xef7e226a43c52d4b8f7b14f13acdf9e75d871ea5c51235fbc4d538acf84c61c4727431f0cc83d0f566e222a21d35ae4d8d2a0dd4428cba7bf95bf7b3f11ad0c61c',
            signer: '0x2222E21c8019b14dA16235319D34b5Dd83E644A9'
        }
    ]
};
exports.internalStateFormat2 = Object.assign(Object.assign({}, exports.internalStateFormat), { channelNonce: exports.internalStateFormat.channelNonce + 1, outcome: {
        assetHolderAddress: '0x4ad3F07BEFDC54511449A1f553E36A653c82eA57',
        type: 'SimpleGuarantee',
        targetChannelId: state_utils_1.calculateChannelId(exports.internalStateFormat),
        destinations: [utils_1.makeDestination('0x63E3FB11830c01ac7C9C64091c14Bb6CbAaC9Ac7')]
    }, signatures: [] });
exports.wireMessageFormat = {
    recipient: '0x11115FAf6f1BF263e81956F0Cc68aEc8426607cf',
    sender: '0x2222E21c8019b14dA16235319D34b5Dd83E644A9',
    data: {
        signedStates: [exports.wireStateFormat, wireStateFormat2],
        objectives: [
            {
                type: 'OpenChannel',
                data: {
                    targetChannelId: '0x59fb8a0bff0f4553b0169d4b6cad93f3baa9edd94bd28c954ae0ad1622252967',
                    fundingStrategy: 'Direct'
                },
                participants: [
                    {
                        destination: '0x00000000000000000000000063E3FB11830c01ac7C9C64091c14Bb6CbAaC9Ac7',
                        participantId: '0x11115FAf6f1BF263e81956F0Cc68aEc8426607cf',
                        signingAddress: '0x11115FAf6f1BF263e81956F0Cc68aEc8426607cf'
                    },
                    {
                        destination: '0x00000000000000000000000063E3FB11830c01ac7C9C64091c14Bb6CbAaC9Ac7',
                        participantId: '0x2222E21c8019b14dA16235319D34b5Dd83E644A9',
                        signingAddress: '0x2222E21c8019b14dA16235319D34b5Dd83E644A9'
                    }
                ]
            }
        ]
    }
};
exports.internalMessageFormat = {
    signedStates: [exports.internalStateFormat, exports.internalStateFormat2],
    objectives: [
        {
            type: 'OpenChannel',
            data: {
                targetChannelId: '0x59fb8a0bff0f4553b0169d4b6cad93f3baa9edd94bd28c954ae0ad1622252967',
                fundingStrategy: 'Direct'
            },
            participants: [
                {
                    destination: utils_1.makeDestination('0x63E3FB11830c01ac7C9C64091c14Bb6CbAaC9Ac7'),
                    participantId: '0x11115FAf6f1BF263e81956F0Cc68aEc8426607cf',
                    signingAddress: '0x11115FAf6f1BF263e81956F0Cc68aEc8426607cf'
                },
                {
                    destination: utils_1.makeDestination('0x63E3FB11830c01ac7C9C64091c14Bb6CbAaC9Ac7'),
                    participantId: '0x2222E21c8019b14dA16235319D34b5Dd83E644A9',
                    signingAddress: '0x2222E21c8019b14dA16235319D34b5Dd83E644A9'
                }
            ]
        }
    ]
};
//# sourceMappingURL=example.js.map