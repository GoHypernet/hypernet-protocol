import { GovernanceCard } from "@hypernetlabs/web-ui";

export default {
  title: "Layout/GovernanceCard",
  component: GovernanceCard,
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
    <GovernanceCard {...args} />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  children: "Children here!!",
};
