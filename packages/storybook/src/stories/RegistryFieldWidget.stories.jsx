import { RegistryFieldWidget } from "@hypernetlabs/web-ui";

export default {
  title: "Layout/RegistryFieldWidget",
  component: RegistryFieldWidget,
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
    <RegistryFieldWidget {...args} />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  title: "This is the title",
  value: "This is the value",
  editable: true,
  showCopy: false,
};
