import React from "react";
import { Box, Tabs, Tab, AppBar } from "@material-ui/core";
import { PushPayment } from "@hypernetlabs/objects";
import { PushPaymentList, AntTabs, AntTab, TabPanel } from "@web-ui/components";
import { useLinks } from "@web-ui/hooks";

interface ILinksWidget {
  noLabel?: boolean;
}

const LinksWidget: React.FC<ILinksWidget> = ({ noLabel }: ILinksWidget) => {
  const [tabValue, setTabValue] = React.useState<number>(0);
  const { links } = useLinks();
  console.log("linkssssssss: ", links);

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
          pushPayments={links.reduce((acc, link) => {
            acc.push(...link.pushPayments);
            return acc;
          }, new Array<PushPayment>())}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <PushPaymentList
          pushPayments={links.reduce((acc, link) => {
            acc.push(...link.pushPayments);
            return acc;
          }, new Array<PushPayment>())}
        />
      </TabPanel>
    </Box>
  );
};

export default LinksWidget;
