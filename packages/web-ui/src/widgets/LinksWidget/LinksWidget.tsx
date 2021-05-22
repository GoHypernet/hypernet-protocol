import React from "react";
import { Box, AppBar } from "@material-ui/core";
import { PushPayment, PullPayment } from "@hypernetlabs/objects";
import {
  PullPaymentList,
  PushPaymentList,
  AntTabs,
  AntTab,
  TabPanel,
} from "@web-ui/components";
import { useLinks } from "@web-ui/hooks";

interface ILinksWidget {
  noLabel?: boolean;
}

const LinksWidget: React.FC<ILinksWidget> = ({ noLabel }: ILinksWidget) => {
  const [tabValue, setTabValue] = React.useState<number>(0);
  const {
    links,
    publicIdentifier,
    acceptPayment,
    disputePayment,
    pullFunds,
  } = useLinks();
  console.log("link list: ", links);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      {!noLabel && <Box>TRANSACTIONS HISTORY: </Box>}
      <AppBar position="static" color="transparent" elevation={0}>
        <AntTabs
          value={tabValue}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <AntTab label="Push Payments" />
          <AntTab label="Pull Payments" />
        </AntTabs>
      </AppBar>
      <TabPanel value={tabValue} index={0}>
        <PushPaymentList
          publicIdentifier={publicIdentifier}
          pushPayments={links.reduce((acc, link) => {
            acc.push(...link.pushPayments);
            return acc;
          }, new Array<PushPayment>())}
          onAcceptPushPaymentClick={acceptPayment}
          onDisputePushPaymentClick={disputePayment}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <PullPaymentList
          publicIdentifier={publicIdentifier}
          pullPayments={links.reduce((acc, link) => {
            acc.push(...link.pullPayments);
            return acc;
          }, new Array<PullPayment>())}
          onAcceptPullPaymentClick={acceptPayment}
          onDisputePullPaymentClick={disputePayment}
          onPullFundClick={pullFunds}
        />
      </TabPanel>
    </Box>
  );
};

export default LinksWidget;
