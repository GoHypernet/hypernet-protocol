import * as ko from "knockout";
import html from "./LinkStatus.template.html";
import { ELinkStatus } from "@hypernetlabs/hypernet-core";

export class LinkStatusParams {
  constructor(public status: ko.Observable<ELinkStatus>) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LinkStatusViewModel {
  public linkStatus: ko.PureComputed<string>;

  protected status: ko.Observable<ELinkStatus>;

  constructor(params: LinkStatusParams) {
    this.status = params.status;

    this.linkStatus = ko.pureComputed<string>(() => {
      const value = this.status();
      if (value === ELinkStatus.INTENDED) {
        return "INTENDED";
      } else if (value === ELinkStatus.LINK_REQUEST_SENT) {
        return "LINK_REQUESTED_SENT";
      } else if (value === ELinkStatus.MESSAGING_ESTABLISHED) {
        return "MESSAGING_ESTABLISHED";
      } else if (value === ELinkStatus.CHANNEL_OPENED) {
        return "CHANNEL_OPENED";
      } else if (value === ELinkStatus.STAKED) {
        return "STAKED";
      } else if (value === ELinkStatus.RUNNING) {
        return "RUNNING";
      } else if (value === ELinkStatus.DISPUTED) {
        return "DISPUTED";
      } else if (value === ELinkStatus.CLOSING) {
        return "CLOSING";
      } else if (value === ELinkStatus.CLOSED) {
        return "CLOSED";
      } else if (value === ELinkStatus.DENIED) {
        return "DENIED";
      }
      return "UNKNOWN";
    });
  }
}

ko.components.register("link-status", {
  viewModel: LinkStatusViewModel,
  template: html,
});
