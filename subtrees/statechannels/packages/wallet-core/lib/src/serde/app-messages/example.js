"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bytes_1 = require("@ethersproject/bytes");
const config_1 = require("../../config");
const utils_1 = require("../../utils");
const constants_1 = require("../../constants");
const bignumber_1 = require("../../bignumber");
exports.externalEthAllocation = [
    {
        token: constants_1.ETH_TOKEN,
        allocationItems: [
            {
                amount: bytes_1.hexZeroPad('0x5', 32),
                destination: '0x000000000000000000000000A5C9d076B3FC5910d67b073CBF75C4e13a5AC6E5'
            },
            {
                amount: bytes_1.hexZeroPad('0x5', 32),
                destination: '0x000000000000000000000000BAF5D86514365D487ea69B7D7c85913E5dF51648'
            }
        ]
    }
];
exports.internalEthAllocation = {
    assetHolderAddress: config_1.ETH_ASSET_HOLDER_ADDRESS,
    allocationItems: [
        {
            amount: bignumber_1.BN.from(bytes_1.hexZeroPad('0x5', 32)),
            destination: utils_1.makeDestination('0xA5C9d076B3FC5910d67b073CBF75C4e13a5AC6E5')
        },
        {
            amount: bignumber_1.BN.from(bytes_1.hexZeroPad('0x5', 32)),
            destination: utils_1.makeDestination('0xBAF5D86514365D487ea69B7D7c85913E5dF51648')
        }
    ],
    type: 'SimpleAllocation'
};
exports.externalMixedAllocation = [
    exports.externalEthAllocation[0],
    {
        token: '0x1000000000000000000000000000000000000001',
        allocationItems: [
            {
                amount: bytes_1.hexZeroPad('0x1', 32),
                destination: '0x000000000000000000000000A5C9d076B3FC5910d67b073CBF75C4e13a5AC6E5'
            },
            {
                amount: bytes_1.hexZeroPad('0x1', 32),
                destination: '0x000000000000000000000000BAF5D86514365D487ea69B7D7c85913E5dF51648'
            }
        ]
    }
];
exports.internalMixedAllocation = {
    type: 'MixedAllocation',
    simpleAllocations: [
        exports.internalEthAllocation,
        {
            type: 'SimpleAllocation',
            assetHolderAddress: '0x1111111111111111111111111111111111111111',
            allocationItems: [
                {
                    amount: bignumber_1.BN.from(bytes_1.hexZeroPad('0x1', 32)),
                    destination: utils_1.makeDestination('0xA5C9d076B3FC5910d67b073CBF75C4e13a5AC6E5')
                },
                {
                    amount: bignumber_1.BN.from(bytes_1.hexZeroPad('0x1', 32)),
                    destination: utils_1.makeDestination('0xBAF5D86514365D487ea69B7D7c85913E5dF51648')
                }
            ]
        }
    ]
};
//# sourceMappingURL=example.js.map