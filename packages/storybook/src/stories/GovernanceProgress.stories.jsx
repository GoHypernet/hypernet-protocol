import { GovernanceProgress, colors } from "@hypernetlabs/web-ui";

export default {
  title: "Layout/GovernanceProgress",
  component: GovernanceProgress,
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
    <GovernanceProgress value={10} />
    <GovernanceProgress value={10} color={colors.RED700} />
    <GovernanceProgress value={50} color={colors.GREEN700} />
    <GovernanceProgress value={40} color={colors.GRAY500} />
    <GovernanceProgress value={100} color={colors.GRAY500} />

    <GovernanceProgress value={50} color={colors.GREEN700} height={24} />
    <GovernanceProgress value={20} color={colors.RED700} height={12} />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {};
