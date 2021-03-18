import React from "react";
import moment from "moment";
import { EPaymentState } from "@hypernetlabs/objects/types";
import { ILinkList } from "../../interfaces";
import {utils} from "ethers";

interface LinkListProps {
  links?: ILinkList[];
}

class PaymentStatusParams {
  constructor(public state: EPaymentState) {}
}

const LinkList: React.FC<LinkListProps> = (props: LinkListProps) => {
  const { links } = props;

  return (
    <div>
      {links?.map((link, index) => (
        <div key={index}>
          <h2>{link.counterPartyAccount}</h2>
          {link.pushPayments.map((pushPayment, index) => (
            <div key={index}>
              <p>
                <b>Push Payment: </b>Payment {pushPayment.id}
              </p>
              <p>
                <b>To: </b> {pushPayment.to}
              </p>
              <p>
                <b>From: </b> {pushPayment.from}
              </p>
              <p>
                <b>State: </b> {new PaymentStatusParams(pushPayment.state).state}
              </p>
              <p>
                <b>Payment Token: </b> {pushPayment.paymentToken}
              </p>
              <p>
                <b>Required Stake: </b> {utils.formatUnits(pushPayment.requiredStake, "wei")}
              </p>
              <p>
                <b>Amount Staked: </b> {utils.formatUnits(pushPayment.amountStaked, "wei")}
              </p>
              <p>
                <b>Expiration Date: </b> {moment.unix(pushPayment.expirationDate).format()}
              </p>
              <p>
                <b>Created: </b> {pushPayment.createdTimestamp.toString()}
              </p>
              <p>
                <b>Updated: </b> {pushPayment.updatedTimestamp.toString()}
              </p>
              <p>
                <b>Collateral Recovered: </b> {utils.formatUnits(pushPayment.collateralRecovered, "wei")}
              </p>
              <p>
                <b>Dispute Mediator: </b> {pushPayment.merchantUrl}
              </p>
              <p>
                <b>Payment Amount: </b> {utils.formatUnits(pushPayment.paymentAmount, "wei")}
              </p>
            </div>
          ))}
          <br />
          {/* map through pullPayment when core is ready. */}
          <hr />
        </div>
      ))}
    </div>
  );
};

export default LinkList;
