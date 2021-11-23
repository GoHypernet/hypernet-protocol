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
    <GovernanceStatusTag {...args} status={EProposalState.ACTIVE} />
    <GovernanceStatusTag {...args} status={EProposalState.DEFEATED} />
    <GovernanceStatusTag {...args} status={EProposalState.SUCCEEDED} />
    <GovernanceStatusTag {...args} status={EProposalState.EXECUTED} />
    <GovernanceStatusTag {...args} status={EProposalState.PENDING} />
    <GovernanceStatusTag {...args} status={EProposalState.CANCELED} />
    <GovernanceStatusTag {...args} status={EProposalState.QUEUED} />
    <GovernanceStatusTag {...args} status={EProposalState.EXPIRED} />
    <GovernanceStatusTag {...args} status={EProposalState.UNDETERMINED} />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {};
