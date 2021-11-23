import { GovernanceRegistryListItem } from "@hypernetlabs/web-ui";

export default {
  title: "Layout/GovernanceRegistryListItem",
  component: GovernanceRegistryListItem,
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
    <GovernanceRegistryListItem
      {...args}
      actionButtonList={[
        {
          label: "Details",
          onClick: () => {
            console.log("Details Clicked");
          },
        },
      ]}
    />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  number: "1",
  title: "Registry Name",
  fieldWithValueList: [
    {
      fieldTitle: "Field Title 1",
      fieldValue: "Field Value 1",
    },
    {
      fieldTitle: "Field Title 2",
      fieldValue: "Field Value 2",
    },
  ],
};
