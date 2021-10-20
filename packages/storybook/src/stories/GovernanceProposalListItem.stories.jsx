import { GovernanceProposalListItem } from "@hypernetlabs/web-ui";
import { EProposalState } from "@hypernetlabs/objects";

export default {
  title: "Layout/GovernanceProposalListItem",
  component: GovernanceProposalListItem,
};

const Template = (args) => (
  <div
    style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-evenly",
      padding: "40px 80px",
    }}
  >
    <GovernanceProposalListItem
      {...args}
      number="1.1"
      title="This is my proposal title we can see the second row"
      status={EProposalState.EXECUTED}
    />
    <GovernanceProposalListItem
      {...args}
      number="1.1"
      title="This is my proposal title we can see the second row"
      status={EProposalState.SUCCEEDED}
    />
    <GovernanceProposalListItem
      {...args}
      number="1.2"
      title="This is my proposal title we can see the second row"
      status={EProposalState.ACTIVE}
    />
    <GovernanceProposalListItem
      {...args}
      number="1.3"
      title="This is my proposal title we can see the second row"
      status={EProposalState.DEFEATED}
    />
    <GovernanceProposalListItem
      {...args}
      number="1.3"
      title="This is my proposal title we can see the second row"
      status={EProposalState.PENDING}
    />
    <GovernanceProposalListItem
      {...args}
      number="1.4"
      title="This is my proposal title we can see the second row"
      status={EProposalState.QUEUED}
    />
    <GovernanceProposalListItem
      {...args}
      number="1.5"
      title="This is my proposal title we can see the second row"
      status={EProposalState.CANCELED}
    />
    <GovernanceProposalListItem
      {...args}
      number="1.6"
      title="This is my proposal title we can see the second row"
      status={EProposalState.EXPIRED}
    />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {};
