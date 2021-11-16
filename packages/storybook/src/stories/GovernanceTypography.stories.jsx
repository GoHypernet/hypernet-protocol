import { GovernanceTypography } from "@hypernetlabs/web-ui";

export default {
  title: "Layout/GovernanceTypography",
  component: GovernanceTypography,
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
    <GovernanceTypography variant="h1">
      Something lorem ipsum lolo !
    </GovernanceTypography>
    <GovernanceTypography variant="h2">
      Something lorem ipsum lolo !
    </GovernanceTypography>
    <GovernanceTypography variant="h3">
      Something lorem ipsum lolo !
    </GovernanceTypography>
    <GovernanceTypography variant="h4">
      Something lorem ipsum lolo !
    </GovernanceTypography>
    <GovernanceTypography variant="h5">
      Something lorem ipsum lolo !
    </GovernanceTypography>
    <GovernanceTypography variant="h6">
      Something lorem ipsum lolo !
    </GovernanceTypography>
    <GovernanceTypography variant="subtitle1">
      Somethin g lorem ipsum lolo !
    </GovernanceTypography>
    <GovernanceTypography variant="body1">
      Something lorem ipsum lolo !
    </GovernanceTypography>
    <GovernanceTypography variant="body2">
      Something lorem ipsum lolo !
    </GovernanceTypography>
  </div>
);

export const Primary = Template.bind({});
Primary.args = {};
