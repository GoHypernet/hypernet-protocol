declare module "@metamask/detect-provider" {
  import { provider } from "web3-core";
  export default function detectEthereumProvider(): Promise<provider>;
}
