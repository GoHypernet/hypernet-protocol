import { Subject } from "rxjs";
import { ActiveStateChannel } from "@objects/ActiveStateChannel";

export interface IUIData {
  onSelectedStateChannelChanged: Subject<ActiveStateChannel>;
  getSelectedStateChannel: () => ActiveStateChannel;
}
