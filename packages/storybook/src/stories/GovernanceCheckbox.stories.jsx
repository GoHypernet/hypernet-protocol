import { GovernanceCheckbox } from "@hypernetlabs/web-ui";

export default {
  title: "Layout/GovernanceCheckbox",
  component: GovernanceCheckbox,
};

const Template = () => (
  <div style={{ display: "flex" }}>
    <GovernanceCheckbox
      size="small"
      color="primary"
      disableRipple
      onChange={(e) => {
        console.log(e);
      }}
    />
    <p>Test</p>
  </div>
);

export const Primary = Template.bind({});
Primary.args = {};
