import { GovernanceStatusTag } from "@hypernetlabs/web-ui";
import { EProposalState } from "@hypernetlabs/objects";

export default {
  title: "Layout/GovernanceStatusTag",
  component: GovernanceStatusTag,
};

const Template = (args) => (
  <div
    style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-evenly",
    }}
  >
    <GovernanceStatusTag status={EProposalState.ACTIVE} />
    <GovernanceStatusTag status={EProposalState.DEFEATED} />
    <GovernanceStatusTag status={EProposalState.SUCCEEDED} />
    <GovernanceStatusTag status={EProposalState.EXECUTED} />
    <GovernanceStatusTag status={EProposalState.PENDING} />
    <GovernanceStatusTag status={EProposalState.CANCELED} />
    <GovernanceStatusTag status={EProposalState.QUEUED} />
    <GovernanceStatusTag status={EProposalState.EXPIRED} />
    <GovernanceStatusTag status={EProposalState.UNDETERMINED} />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {};
