import { Subject } from "rxjs";
import { ActiveStateChannel } from "@objects/ActiveStateChannel";
import { IHypernetCore } from "@objects/interfaces/IHypernetCore";

export interface IUIEvents {
  onSelectedStateChannelChanged: Subject<ActiveStateChannel>;
}

export interface IHypernetIFrameProxy extends IHypernetCore {
  UIEvents: IUIEvents;
}
