# The Graph Connector for Hypernetlabs Voting

## Usage

```js
const org = await connect(
  <org-address>,
  'thegraph',
  { chainId: <chain-id> }
)
const apps = await org.apps()
const hypernetlabsVotingApp = apps.find(
  app => app.appName === 'hypernetlabs-voting.aragonpm.eth'
)

const hypernetlabsVotingInstance = new HypernetlabsVoting(
  hypernetlabsVotingApp.address,
  <subgraph-url>
)

const votes = await hypernetlabsVotingInstance.votes()
```
