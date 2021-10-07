import {
  GovernanceButton,
  GovernanceListItem,
  GovernanceValueWithTitle,
} from "@hypernetlabs/web-ui";

export default {
  title: "Layout/GovernanceListItem",
  component: GovernanceListItem,
};

const Template = (args) => (
  <div
    style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-evenly",
      padding: "40px 80px",
    }}
  >
    <GovernanceListItem
      {...args}
      rightContent={
        <GovernanceButton variant="contained" size="medium">
          View Details
        </GovernanceButton>
      }
    />
    <GovernanceListItem
      {...args}
      rightContent={
        <GovernanceButton variant="contained" size="medium">
          View Details
        </GovernanceButton>
      }
    >
      <p>This is Body</p>
    </GovernanceListItem>
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  number: "1.1",
  title: "List item title",
};
