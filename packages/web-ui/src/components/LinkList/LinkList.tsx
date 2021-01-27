import React from "react";
import Web3 from "web3";
import moment from "moment";
import { EPaymentState } from "@hypernetlabs/hypernet-core";
import { ILinkList } from "../../interfaces";

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
                <b>Required Stake: </b> {Web3.utils.fromWei(pushPayment.requiredStake._hex)}
              </p>
              <p>
                <b>Amount Staked: </b> {Web3.utils.fromWei(pushPayment.amountStaked._hex)}
              </p>
              <p>
                <b>Expiration Date: </b> {moment.unix(pushPayment.expirationDate).format()}
              </p>
              <p>
                <b>Finalized: </b> {pushPayment.finalized ? "true" : "false"}
              </p>
              <p>
                <b>Created: </b> {pushPayment.createdTimestamp.toString()}
              </p>
              <p>
                <b>Updated: </b> {pushPayment.updatedTimestamp.toString()}
              </p>
              <p>
                <b>Collateral Recovered: </b> {Web3.utils.fromWei(pushPayment.collateralRecovered._hex)}
              </p>
              <p>
                <b>Dispute Mediator: </b> {pushPayment.disputeMediator}
              </p>
              <p>
                <b>Payment Amount: </b> {Web3.utils.fromWei(pushPayment.paymentAmount._hex)}
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
