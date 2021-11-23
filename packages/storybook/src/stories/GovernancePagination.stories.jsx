import { GovernancePagination } from "@hypernetlabs/web-ui";

export default {
  title: "Layout/GovernancePagination",
  component: GovernancePagination,
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
    <GovernancePagination
      {...args}
      count={10}
      onChange={(_, value) => {
        console.log(value);
      }}
    />
    <GovernancePagination
      {...args}
      customPageOptions={{
        itemsPerPage: 10,
        totalItems: 25,
      }}
    />
    <GovernancePagination
      {...args}
      customPageOptions={{
        itemsPerPage: 5,
        totalItems: 23,
        currentPageStartIndex: 16,
      }}
    />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {};
