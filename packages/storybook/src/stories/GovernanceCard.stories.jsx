import { GovernanceCard, GovernanceCardHeader } from "@hypernetlabs/web-ui";

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

    <GovernanceCard
      {...args}
      title="Card Title"
      description="Some descriptions lolo tetete"
    />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  children: "Children here!!",
};
