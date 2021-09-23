import { GovernanceMarkdown } from "@hypernetlabs/web-ui";

export default {
  title: "Layout/GovernanceMarkdown",
  component: GovernanceMarkdown,
};

const markdown = `
# A demo of \`react-markdown\`
## A demo of \`react-markdown\`
### A demo of \`react-markdown\`
`;

const Template = (args) => (
  <div>
    <GovernanceMarkdown {...args} />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  source: markdown,
};
