import { GovernanceRadio } from "@hypernetlabs/web-ui";

export default {
  title: "Layout/GovernanceRadio",
  component: GovernanceRadio,
};

const Template = () => (
  <div style={{ display: "flex" }}>
    <GovernanceRadio />
    <p>Test</p>
  </div>
);

export const Primary = Template.bind({});
Primary.args = {};
