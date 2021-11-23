import { GovernanceChip } from "@hypernetlabs/web-ui";

export default {
  title: "Layout/GovernanceChip",
  component: GovernanceChip,
  argTypes: {
    size: {
      control: { type: "select", options: ["small", "medium"] },
    },
    color: {
      control: { type: "select", options: ["orange", "blue", "green", "gray"] },
    },
  },
};

const Template = (args) => <GovernanceChip {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  label: "Chip",
  color: "orange",
  size: "small",
};
