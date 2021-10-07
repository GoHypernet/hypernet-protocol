import { GovernanceBasicValueWithTitle } from "@hypernetlabs/web-ui";

export default {
  title: "Layout/GovernanceBasicValueWithTitle",
  component: GovernanceBasicValueWithTitle,
};

const Template = (args) => (
  <div
    style={{
      height: "100vh",
      width: 600,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-evenly",
    }}
  >
    <GovernanceBasicValueWithTitle {...args} />
    <GovernanceBasicValueWithTitle {...args} />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  title: "Title",
  value: "This is the value.",
};
