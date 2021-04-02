import VotingConnectorTheGraph from "../connector";

export default class HypernetlabsVotingEntity {
  protected _connector: VotingConnectorTheGraph

  constructor(connector: VotingConnectorTheGraph) {
    this._connector = connector
  }
}