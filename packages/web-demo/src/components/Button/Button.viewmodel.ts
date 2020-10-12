import * as ko from "knockout";
import html from "./Button.template.html";

export enum EButtonType {
  Normal,
  Warning,
  Danger,
}

export class ButtonParams {
  constructor(
    public buttonText: string,
    public action: () => Promise<any> | null,
    public type: EButtonType = EButtonType.Normal,
  ) {}
}

// tslint:disable-next-line: max-classes-per-file
export class ButtonViewModel {
  public showSpinner: ko.Observable<boolean>;
  public buttonText: string;

  protected action: () => Promise<any> | null;

  constructor(params: ButtonParams) {
    this.action = params.action;
    this.buttonText = params.buttonText;

    this.showSpinner = ko.observable<boolean>(false);
  }

  public async click() {
    const actionResult = this.action();
    if (actionResult != null) {
      this.showSpinner(true);
      await actionResult;
      this.showSpinner(false);
    }
  }
}

ko.components.register("button", {
  viewModel: ButtonViewModel,
  template: html,
});
