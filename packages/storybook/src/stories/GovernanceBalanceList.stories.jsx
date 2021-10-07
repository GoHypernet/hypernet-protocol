import {
  GovernanceBalanceList,
  GovernanceCard,
  ViewUtils,
} from "@hypernetlabs/web-ui";

import { AssetBalance } from "@hypernetlabs/objects";

export default {
  title: "Layout/GovernanceBalanceList",
  component: GovernanceBalanceList,
};

const balances = [
  new AssetBalance("1", "1", "HYPERTOKEN", "HYPR", 8, 1000000, 0, 17),
  new AssetBalance("2", "2", "ETHEREUM", "ETH", 8, 1000000, 0, 4),
  new AssetBalance("3", "3", "TOKEN3", "TKN3", 8, 1000000, 0, 0),
  new AssetBalance("4", "4", "TOKEN4", "TKN4", 8, 1000000, 0, 0),
];

const Template = (args) => (
  <div style={{}}>
    <GovernanceBalanceList {...args} />

    <GovernanceCard>
      <GovernanceBalanceList {...args} />
    </GovernanceCard>
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  balances: balances,
  viewUtils: new ViewUtils(),
};
