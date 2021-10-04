import { GovernanceDialogSelectLargeField } from "@hypernetlabs/web-ui";

export default {
  title: "Layout/GovernanceDialogSelectLargeField",
  component: GovernanceDialogSelectLargeField,
};

const Template = (args) => (
  <div
    style={{
      padding: "40px 80px",
    }}
  >
    <GovernanceDialogSelectLargeField
      {...args}
      name="98"
      title="Crypto Currency"
      options={[
        {
          primaryText: "ETH",
          secondaryText: "Ethereum",
          icon: (
            <img src="https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.16.1/32/color/eth.png" />
          ),
          action: null,
          value: "eth",
        },
        {
          primaryText: "BTC",
          secondaryText: "Bitcoin",
          icon: (
            <img src="https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.16.1/32/color/btc.png" />
          ),
          action: null,
          value: "btc",
        },
      ]}
    />
    <GovernanceDialogSelectLargeField
      {...args}
      name="99"
      options={[
        {
          primaryText: "Add Registry",
          secondaryText: null,
          action: null,
          value: "add_registry",
        },
        {
          primaryText: "Add Gateway",
          secondaryText: null,
          action: null,
          value: "add_gateway",
        },
      ]}
    />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  title: "Proposed Action",
  required: false,
};

const formParams = {
  formik: {
    initialValues: {
      98: "eth",
      99: "add_gateway",
    },
  },
};
Primary.parameters = formParams;
