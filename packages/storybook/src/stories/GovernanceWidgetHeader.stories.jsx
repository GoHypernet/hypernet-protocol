import {
  GovernanceWidgetHeader,
  GovernanceButton,
  GovernanceStatusTag,
} from "@hypernetlabs/web-ui";
import { EProposalState } from "@hypernetlabs/objects";

export default {
  title: "Layout/GovernanceWidgetHeader",
  component: GovernanceWidgetHeader,
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
    <GovernanceWidgetHeader {...args} />
    <GovernanceWidgetHeader
      {...args}
      rightContent={
        <>
          <GovernanceButton
            onClick={() => {
              console.log("Create Proposal");
            }}
            variant="outlined"
          >
            Create Proposal
          </GovernanceButton>
          <GovernanceButton
            onClick={() => {
              console.log("Delegate Voting");
            }}
            variant="contained"
            color="primary"
          >
            Delegate Voting
          </GovernanceButton>
        </>
      }
    />
    <GovernanceWidgetHeader
      {...args}
      label="Proposals"
      headerActions={[
        {
          label: "Create Proposal",
          onClick: () => {
            console.log("Create Proposal");
          },
          variant: "outlined",
        },
        {
          label: "Delegate Voting",
          onClick: () => {
            console.log("Delegate Voting");
          },
          variant: "contained",
          color: "primary",
        },
      ]}
    />
    <GovernanceWidgetHeader
      {...args}
      rightContent={
        <div style={{ marginLeft: 24 }}>
          <GovernanceButton
            onClick={() => {
              console.log("Create Proposal");
            }}
            variant="outlined"
          >
            Create Proposal
          </GovernanceButton>
          <GovernanceButton
            onClick={() => {
              console.log("Delegate Voting");
            }}
            variant="contained"
            color="primary"
          >
            Delegate Voting
          </GovernanceButton>
        </div>
      }
      headerActions={[
        {
          label: "Create Proposal",
          onClick: () => {
            console.log("Create Proposal");
          },
          variant: "outlined",
        },
        {
          label: "Delegate Voting",
          onClick: () => {
            console.log("Delegate Voting");
          },
          variant: "contained",
          color: "primary",
        },
      ]}
    />
    <GovernanceWidgetHeader
      {...args}
      label="Registries"
      description={
        <div style={{ display: "flex", alignItems: "center" }}>
          <GovernanceStatusTag status={EProposalState.ACTIVE} />
          <p style={{ marginLeft: 16 }}>
            You can update the Identity Data information.
          </p>
        </div>
      }
    />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  label: "Header",
  navigationLink: {
    label: "Back",
    onClick: () => {
      console.log("clicked");
    },
  },
};
