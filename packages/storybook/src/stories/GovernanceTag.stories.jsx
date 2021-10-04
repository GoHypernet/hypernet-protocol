import { GovernanceTag, ETagColor } from "@hypernetlabs/web-ui";

export default {
  title: "Layout/GovernanceTag",
  component: GovernanceTag,
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
    <GovernanceTag {...args} color={ETagColor.BLUE} />
    <GovernanceTag {...args} color={ETagColor.PURPLE} />
    <GovernanceTag {...args} color={ETagColor.GREEN} />
    <GovernanceTag {...args} color={ETagColor.GRAY} />
    <GovernanceTag {...args} color={ETagColor.RED} />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  text: "Hello",
};
