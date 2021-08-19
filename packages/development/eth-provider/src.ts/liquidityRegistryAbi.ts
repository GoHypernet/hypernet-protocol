export default [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_publicidentifier",
        type: "string",
      },
    ],
    name: "getLiquidity",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_publicidentifier",
        type: "string",
      },
      {
        internalType: "string",
        name: "_text",
        type: "string",
      },
    ],
    name: "setLiquidity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
