import {
  GovernanceSideFilter,
  ESideFilterItemType,
  ViewUtils,
} from "@hypernetlabs/web-ui";

export default {
  title: "Layout/GovernanceSideFilter",
  component: GovernanceSideFilter,
};

const viewUtils = new ViewUtils();
const linksFilter = [
  {
    label: "Payment ID",
    widgetType: ESideFilterItemType.stringInput,
    stateKey: "id",
  },
  {
    label: "From",
    widgetType: ESideFilterItemType.stringInput,
    stateKey: "from",
  },
  {
    label: "To",
    widgetType: ESideFilterItemType.stringInput,
    stateKey: "to",
  },
  {
    label: "Gateway URL",
    widgetType: ESideFilterItemType.stringInput,
    stateKey: "gatewayUrl",
  },
  {
    label: "Payment Status",
    widgetType: ESideFilterItemType.select,
    stateKey: "state",
    defaultValue: "all",
    widgetProps: {
      options: viewUtils.getPaymentStateOptions(),
    },
  },
  {
    label: "Created Date",
    widgetType: ESideFilterItemType.dateTimeDifference,
    stateKey: "createdTimestamp",
  },
  {
    label: "Expiration Date",
    widgetType: ESideFilterItemType.dateTimeDifference,
    stateKey: "expirationDate",
  },
];

const Template = (args) => (
  <div style={{}}>
    <GovernanceSideFilter {...args} widgetUniqueIdentifier="storybook" />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  visible: true,
  filterItems: linksFilter,
  onClose: () => {
    console.log("onclose worked");
  },
  onFilterSubmit: () => {
    console.log("onFilterSubmit worked");
  },
};
