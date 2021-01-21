import { IHypernetCore } from "@hypernetlabs/hypernet-core";
import ko from "knockout";
import html from "./Status.template.html";

export class StatusParams {
  constructor(public core: IHypernetCore) {}
}

// tslint:disable-next-line: max-classes-per-file
export class StatusViewModel {
  public core: IHypernetCore;
  public startupComplete: ko.Observable<boolean>;
  public inControl: ko.Observable<boolean>;

  constructor(params: StatusParams) {
    this.core = params.core;
    this.startupComplete = ko.observable(true);
    this.inControl = ko.observable(false);

    this.core.onControlClaimed.subscribe({
      next: () => {
        this.inControl(true);
      },
    });

    this.core.onControlYielded.subscribe({
      next: () => {
        this.inControl(false);
      },
    });
  }
}

ko.components.register("status", {
  viewModel: StatusViewModel,
  template: html,
});
