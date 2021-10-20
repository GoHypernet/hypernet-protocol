import { GovernanceSwitch } from "@hypernetlabs/web-ui";

export default {
  title: "Layout/GovernanceSwitch",
  component: GovernanceSwitch,
  argTypes: {
    initialValue: {
      control: { type: "select", options: ["true", "false"] },
    },
  },
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
    <GovernanceSwitch
      {...args}
      onChange={(checked) => {
        console.log(chedked);
      }}
    />
    <GovernanceSwitch
      initialValue={false}
      onChange={(checked) => {
        console.log(chedked);
      }}
    />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  text: "Hello",
};
