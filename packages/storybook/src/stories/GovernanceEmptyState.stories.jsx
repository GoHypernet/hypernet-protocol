import { GovernanceEmptyState } from "@hypernetlabs/web-ui";

export default {
  title: "Layout/GovernanceEmptyState",
  component: GovernanceEmptyState,
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
    <GovernanceEmptyState {...args} />
    <GovernanceEmptyState
      {...args}
      img={
        <img
          width="150"
          src="https://hypernetlabs.io/wp-content/themes/salient/image/doMore.png"
        />
      }
    />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  title: "Hello",
  description: "some description",
};
