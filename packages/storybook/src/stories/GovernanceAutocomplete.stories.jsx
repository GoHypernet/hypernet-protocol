import { GovernanceAutocomplete } from "@hypernetlabs/web-ui";

export default {
  title: "Layout/GovernanceAutocomplete",
  component: GovernanceAutocomplete,
};

const Template = () => (
  <div
    style={{
      height: "100vh",
      width: 600,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-evenly",
    }}
  >
    <GovernanceAutocomplete
      size="small"
      title="Select Token"
      options={[
        { value: "1", label: "test" },
        { value: "2", label: "test2" },
      ]}
      multiple
      handleChange={(val) => {
        console.log(val);
      }}
    />
  </div>
);

export const Primary = Template.bind({});
