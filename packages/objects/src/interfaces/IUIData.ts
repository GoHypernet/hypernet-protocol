import { Subject } from "rxjs";

import { ActiveStateChannel } from "@objects/ActiveStateChannel";
import { ChainId } from "@objects/ChainId";

export interface IUIData {
  onSelectedStateChannelChanged: Subject<ActiveStateChannel>;
  onVotesDelegated: Subject<void>;
  onCoreGovernanceChainChanged: Subject<ChainId>;
  getSelectedStateChannel: () => ActiveStateChannel;
}
