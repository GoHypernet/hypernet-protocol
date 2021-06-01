import VotingEntity from "./VotingEntity";
import VotingConnectorTheGraph from "../connector";

export interface CastData {
  id: string;
  voteNum: string;
  voteId: string;
  voter: string;
  supports: boolean;
  voterStake: string;
}

export default class Cast extends VotingEntity implements CastData {
  readonly id!: string;
  readonly voteId!: string;
  readonly voteNum!: string;
  readonly voter!: string;
  readonly supports!: boolean;
  readonly voterStake!: string;

  constructor(data: CastData, connector: VotingConnectorTheGraph) {
    super(connector);

    Object.assign(this, data);
  }
}
