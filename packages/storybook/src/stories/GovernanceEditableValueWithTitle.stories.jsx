import { GovernanceEditableValueWithTitle } from "@hypernetlabs/web-ui";

export default {
  title: "Layout/GovernanceEditableValueWithTitle",
  component: GovernanceEditableValueWithTitle,
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
    <GovernanceEditableValueWithTitle
      {...args}
      onSave={(value) => {
        console.log(value);
      }}
    />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  title: "This is the title",
  value: "This is the value",
};
