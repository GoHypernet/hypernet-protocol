// import ko from "knockout";
// import html from "./MessageLog.template.html";

// export class MessageLogParams {
//   constructor(public link: ko.Observable<string>) {}
// }

// // tslint:disable-next-line: max-classes-per-file
// export class MessageLogViewModel {
//   public messageText: ko.Observable<string>;

//   protected link: ko.Observable<HypernetMessageLog>;

//   constructor(params: MessageLogParams) {
//     this.link = params.link;
//     this.id = `MessageLog ${this.link().id}`;
//     this.consumer = this.link().consumer;
//     this.provider = this.link().provider;
//     this.paymentToken = this.link().paymentToken;
//     this.gatewayUrl = this.link().gatewayUrl;

//     this.consumerTotalDeposit = ko.pureComputed(() => {
//       return this.link().consumerTotalDeposit;
//     });
//     this.consumerBalance = ko.pureComputed(() => {
//       return this.link().consumerBalance;
//     });
//     this.providerBalance = ko.pureComputed(() => {
//       return this.link().providerBalance;
//     });
//     this.providerStake = ko.pureComputed(() => {
//       return this.link().providerStake;
//     });
//     this.status = ko.pureComputed(() => {
//       return this.link().status;
//     });
//     this.internalChannelId = ko.pureComputed(() => {
//       return this.link().internalChannelId;
//     });
//     this.threadAddress = ko.pureComputed(() => {
//       return this.link().threadAddress;
//     });
//   }
// }

// ko.components.register("link", {
//   viewModel: MessageLogViewModel,
//   template: html,
// });
