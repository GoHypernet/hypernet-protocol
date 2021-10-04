import { GovernanceButton } from "@hypernetlabs/web-ui";

export default {
  title: "Layout/GovernanceButton",
  component: GovernanceButton,
  argTypes: {
    size: {
      options: ["small", "medium", "large"],
      control: { type: "radio" },
    },
    color: {
      options: ["primary", "secondary", "default"],
      control: { type: "radio" },
    },
  },
};

const Template = (args) => (
  <>
    <div
      style={{
        display: "flex",
        justifyContent: "space-evenly",
        marginBottom: 24,
      }}
    >
      <GovernanceButton {...args} variant="contained">
        Click me!
      </GovernanceButton>
      <GovernanceButton {...args} variant="contained" disabled>
        Click me!
      </GovernanceButton>
      <GovernanceButton {...args} variant="contained" loading>
        Click me!
      </GovernanceButton>
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-evenly",
        marginBottom: 24,
      }}
    >
      <GovernanceButton {...args} variant="outlined">
        Click me!
      </GovernanceButton>
      <GovernanceButton {...args} variant="outlined" disabled>
        Click me!
      </GovernanceButton>
      <GovernanceButton {...args} variant="outlined" loading>
        Click me!
      </GovernanceButton>
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-evenly",
        marginBottom: 24,
      }}
    >
      <GovernanceButton {...args} variant="text">
        Click me!
      </GovernanceButton>
      <GovernanceButton {...args} variant="text" disabled>
        Click me!
      </GovernanceButton>
      <GovernanceButton {...args} variant="text" loading>
        Click me!
      </GovernanceButton>
    </div>

    <div style={{ marginBottom: 24 }}>
      <GovernanceButton {...args} variant="contained" fullWidth>
        Click me!
      </GovernanceButton>
    </div>

    <div style={{ marginBottom: 24 }}>
      <GovernanceButton {...args} variant="outlined" fullWidth>
        Click me!
      </GovernanceButton>
    </div>

    <div style={{ marginBottom: 24 }}>
      <GovernanceButton {...args} variant="text" fullWidth>
        Click me!
      </GovernanceButton>
    </div>

    <div style={{ marginBottom: 24 }}>
      <GovernanceButton {...args} variant="text" fullWidth>
        Click me!
      </GovernanceButton>
    </div>
  </>
);

export const Primary = Template.bind({});
Primary.args = {
  onClick: () => {
    console.log("clicked!");
  },
  size: "medium",
  color: "primary",
};
