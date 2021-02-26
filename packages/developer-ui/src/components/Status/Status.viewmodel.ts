import { IHypernetWebIntegration } from "@hypernetlabs/web-integration";
import ko from "knockout";
import html from "./Status.template.html";

export class StatusParams {
  constructor(public core: IHypernetWebIntegration) {}
}

// tslint:disable-next-line: max-classes-per-file
export class StatusViewModel {
  public core: IHypernetWebIntegration;
  public startupComplete: ko.Observable<boolean>;
  public inControl: ko.Observable<boolean>;

  constructor(params: StatusParams) {
    this.core = params.core;
    this.startupComplete = ko.observable(true);
    this.inControl = ko.observable(false);

    this.core.proxy.onControlClaimed.subscribe({
      next: () => {
        this.inControl(true);
      },
    });

    this.core.proxy.onControlYielded.subscribe({
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
