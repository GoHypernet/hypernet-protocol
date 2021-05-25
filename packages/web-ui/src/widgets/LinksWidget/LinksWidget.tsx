import React, { useState, useMemo } from "react";
import { Box, AppBar, IconButton } from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import { PushPayment, PullPayment, EPaymentState } from "@hypernetlabs/objects";
import {
  PullPaymentList,
  PushPaymentList,
  AntTabs,
  AntTab,
  TabPanel,
  SideFilter,
  BoxWrapper,
} from "@web-ui/components";
import { IFilterItem, EItemType, IRenderParams } from "@web-ui/interfaces";
import { useLinks } from "@web-ui/hooks";
import { useStoreContext } from "@web-ui/contexts";

interface ILinksWidget extends IRenderParams {}

interface ISideFilter {
  id: string;
  from: string;
  to: string;
  merchantUrl: string;
  state: string;
  createdTimestamp: string;
  expirationDate: string;
}

const LinksWidget: React.FC<ILinksWidget> = ({
  noLabel,
  includeBoxWrapper,
}: ILinksWidget) => {
  const { viewUtils } = useStoreContext();
  const [tabValue, setTabValue] = useState<number>(0);
  const [isSideFilterOpen, setIsSideFilterOpen] = useState(false);
  /* const [filter, setFilter] = useState<ISideFilter>({
    id: "",
    from: "",
    to: "",
    merchantUrl: "",
    state: "",
    createdTimestamp: "",
    expirationDate: "",
  }); */
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

  const linksFilter: IFilterItem[] = useMemo(
    () => [
      {
        label: "Search By Payment ID",
        widgetType: EItemType.stringInput,
        stateKey: "id",
      },
      {
        label: "Search By From",
        widgetType: EItemType.stringInput,
        stateKey: "from",
      },
      {
        label: "Search By To",
        widgetType: EItemType.stringInput,
        stateKey: "to",
      },
      {
        label: "Search By Merchant URL",
        widgetType: EItemType.stringInput,
        stateKey: "merchantUrl",
      },
      {
        label: "Search By Payment State",
        widgetType: EItemType.select,
        stateKey: "state",
        defaultValue: EPaymentState.Approved.toString(),
        widgetProps: {
          options: viewUtils.getPaymentStateOptions(),
        },
      },
      {
        label: "Search By created date",
        widgetType: EItemType.dateTime,
        stateKey: "createdTimestamp",
        defaultValue: "2021-01-24T10:30",
      },
      {
        label: "Search By expiration date",
        widgetType: EItemType.dateTime,
        stateKey: "expirationDate",
        defaultValue: "2021-02-24T10:30",
      },
    ],
    [],
  );

  const handleFilterSubmit = (filter?: ISideFilter) => {
    console.log("handleFilterSubmit filter: ", filter);
    /* if (!filter) return;
    setFilter((prevState) => {
      return {
        ...prevState,
        id: filter.id,
        from: filter.from,
        to: filter.to,
        merchantUrl: filter.merchantUrl,
        state: filter.state,
        createdTimestamp: filter.createdTimestamp,
        expirationDate: filter.expirationDate,
      };
    }); */
  };

  const CustomBox = includeBoxWrapper ? BoxWrapper : Box;

  return (
    <CustomBox
      label={!noLabel ? "TRANSACTION HISTORY" : undefined}
      rightComponent={
        <IconButton
          aria-label="list"
          onClick={() => setIsSideFilterOpen(true)}
          style={{ height: 30, display: "flex", fontSize: 18 }}
        >
          <Box marginRight={1}>Filter</Box>
          <FilterListIcon />
        </IconButton>
      }
    >
      <SideFilter
        visible={isSideFilterOpen}
        onClose={() => setIsSideFilterOpen(false)}
        filterItems={linksFilter}
        onFilterSubmit={handleFilterSubmit}
      />
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
    </CustomBox>
  );
};

export default LinksWidget;
