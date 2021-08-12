import { Subject } from "rxjs";
import { ActiveStateChannel } from "@objects/ActiveStateChannel";

export interface IUIEvents {
  onSelectedStateChannelChanged: Subject<ActiveStateChannel>;
}
