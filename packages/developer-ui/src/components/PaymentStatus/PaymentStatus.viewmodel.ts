import { PaymentStatusViewModel } from "@hypernetlabs/objects";
import ko from "knockout";

import html from "./PaymentStatus.template.html";

ko.components.register("payment-status", {
  viewModel: PaymentStatusViewModel,
  template: html,
});
