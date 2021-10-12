import {
  GovernanceDialog,
  GovernanceButton,
  GovernanceField,
} from "@hypernetlabs/web-ui";
import { Button, TextField } from "@material-ui/core";

export default {
  title: "Layout/GovernanceDialog",
  component: GovernanceDialog,
};

const Template = (args) => (
  <div
    style={{
      padding: "40px 80px",
    }}
  >
    <GovernanceDialog {...args} />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  title: "Delegate Voting",
  description:
    "It can be a sentence that describes things that can be done when the enter delegate address.",
  isOpen: true,
  content: (
    <>
      <GovernanceField
        name="address"
        label="Delegate Address"
        fullWidth
        variant="outlined"
      />
      <GovernanceButton
        variant="contained"
        color="primary"
        fullWidth
        style={{ marginTop: 24 }}
      >
        Delegate Votes
      </GovernanceButton>
    </>
  ),
};

const formParams = {
  formik: {
    initialValues: {
      address: "some wallet address",
    },
  },
};
Primary.parameters = formParams;
