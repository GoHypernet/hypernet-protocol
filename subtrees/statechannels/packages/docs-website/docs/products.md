---
id: products
title: Our products
---

import Mermaid from '@theme/Mermaid';

The following diagram describes our tech stack. Clicking on a node will take you to the repository for that product. The products with a thick border are covered by the documentation on this site.

<Mermaid chart='
flowchart TB;
linkStyle default interpolate basis;
subgraph A [application layer];
    channelclient("fab:fa-npm channel-client");
    channelprovider("fab:fa-npm channel-provider");
    browserwallet("fab:fa-npm browser-wallet");
    serverwallet("server-wallet");
    walletcore("fab:fa-npm wallet-core");
end;
subgraph P [protocol layer];
    nitroprotocol("fab:fa-npm nitro-protocol");
    forcemovePDF("far:fa-file-pdf ForceMove");
    nitroPDF("far:fa-file-pdf Nitro");
end;
subgraph S [schema layer];
    apischema("fab:fa-npm client-api-schema");
    wireformat("fab:fa-npm wire-format");
end
A --> P;
A --> S;
browserwallet--> walletcore;
serverwallet--> walletcore;
nitroprotocol--> nitroPDF;
nitroprotocol--> forcemovePDF;
click nitroprotocol "https://www.npmjs.com/package/@statechannels/nitro-protocol";
click channelclient "https://www.npmjs.com/package/@statechannels/channel-client";
click channelprovider "https://www.npmjs.com/package/@statechannels/channel-provider";
click browserwallet "https://www.npmjs.com/package/@statechannels/xstate-wallet";
click walletcore "https://www.npmjs.com/package/@statechannels/wallet-core";
click apischema "https://www.npmjs.com/package/@statechannels/client-api-schema";
click wireformat "https://www.npmjs.com/package/@statechannels/wire-format";
click forcemovePDF "https://magmo.com/force-move-games.pdf";
click nitroPDF "https://magmo.com/nitro-protocol.pdf";
click serverwallet "https://github.com/statechannels/statechannels";
classDef unpublished stroke:#3531FF,stroke-width:0px;
classDef documented stroke:#3531FF,stroke-width:3px;
class serverwallet unpublished;
class nitroprotocol documented;
class channelclient documented;
class apischema documented;
class channelprovider documented;' />
