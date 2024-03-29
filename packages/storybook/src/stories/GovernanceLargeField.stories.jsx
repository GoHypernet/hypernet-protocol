import { GovernanceLargeField, ISelectOption } from "@hypernetlabs/web-ui";

export default {
  title: "Layout/GovernanceLargeField",
  component: GovernanceLargeField,
  argTypes: {
    type: {
      options: ["input", "textarea", "select"],
      control: { type: "radio" },
    },
  },
};

const Template = (args) => (
  <div
    style={{
      padding: "40px 80px",
    }}
  >
    <GovernanceLargeField {...args} name="1" />

    <GovernanceLargeField {...args} type="input" name="98" />
    <GovernanceLargeField
      {...args}
      name="99"
      title="Proposes Action"
      type="select"
      placeholder={"select something"}
      options={[
        { label: "label1", value: 1 },
        { label: "label2", value: 2 },
      ]}
    />
    <GovernanceLargeField
      {...args}
      name="100"
      title="Proposals"
      type="textarea"
      rows={14}
      placeholder={`## Summary \n\nInsert your summary here \n\n## Methodology\n\nInsert your methodology here \n\n## Conclusion \n\nInsert your conclusion here \n\n`}
    />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  title: "Gateway Url",
  type: "input",
  placeholder: "Type a gateway url",
  required: false,
  rows: 1,
};
