import { GovernanceValueWithTitle } from "@hypernetlabs/web-ui";

export default {
  title: "Layout/GovernanceValueWithTitle",
  component: GovernanceValueWithTitle,
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
    <GovernanceValueWithTitle {...args} />
    <GovernanceValueWithTitle {...args} />
    <GovernanceValueWithTitle {...args} />
    <GovernanceValueWithTitle
      {...args}
      showCopy
      topRightContent={
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            borderWidth: 4,
            backgroundColor: "gray",
          }}
        />
      }
      bottomRightContent={
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            borderWidth: 4,
            backgroundColor: "yellow",
          }}
        />
      }
    />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  title: "Title",
  value: "This is the value.",
};
