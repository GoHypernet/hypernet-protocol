import { IHypernetWebIntegration } from "@hypernetlabs/web-integration";
import ko from "knockout";

import html from "./Status.template.html";

export class StatusParams {
  constructor(public integration: IHypernetWebIntegration) {}
}

// tslint:disable-next-line: max-classes-per-file
export class StatusViewModel {
  public integration: IHypernetWebIntegration;
  public startupComplete: ko.Observable<boolean>;
  public inControl: ko.Observable<boolean>;

  constructor(params: StatusParams) {
    this.integration = params.integration;
    this.startupComplete = ko.observable(true);
    this.inControl = ko.observable(false);

    this.integration.core.onControlClaimed.subscribe({
      next: () => {
        this.inControl(true);
      },
    });

    this.integration.core.onControlYielded.subscribe({
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
