import { GovernanceWidgetHeader, GovernanceButton } from "@hypernetlabs/web-ui";

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
