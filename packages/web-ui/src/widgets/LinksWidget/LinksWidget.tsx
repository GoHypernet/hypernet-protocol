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
  createdTimestampFrom: string;
  createdTimestampTo: string;
  expirationDateFrom: string;
  expirationDateTo: string;
}

const LinksWidget: React.FC<ILinksWidget> = ({
  noLabel,
  includeBoxWrapper,
}: ILinksWidget) => {
  const { viewUtils, dateUtils } = useStoreContext();
  const [tabValue, setTabValue] = useState<number>(0);
  const [isSideFilterOpen, setIsSideFilterOpen] = useState(false);
  const [filter, setFilter] = useState<ISideFilter>();
  console.log("filter", filter);
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
        defaultValue: "all",
        widgetProps: {
          options: viewUtils.getPaymentStateOptions(),
        },
      },
      {
        label: "Search By created date",
        widgetType: EItemType.dateTimeDifference,
        stateKey: "createdTimestamp",
        defaultValue: "2021-01-01T00:00",
      },
      {
        label: "Search By expiration date",
        widgetType: EItemType.dateTimeDifference,
        stateKey: "expirationDate",
        defaultValue: "2021-01-01T00:00",
      },
    ],
    [],
  );

  const handleFilterSubmit = (filter?: ISideFilter) => {
    console.log("handleFilterSubmit filter: ", filter);
    if (!filter) return;
    setFilter(filter);
  };

  const getPushPayments = (): PushPayment[] => {
    return links.reduce((acc, link) => {
      const pushPayments = link.pushPayments.filter((pushPayment) => {
        return (
          pushPayment.id.includes(filter?.id || "") &&
          pushPayment.from.includes(filter?.from || "") &&
          pushPayment.to.includes(filter?.to || "") &&
          pushPayment.merchantUrl.includes(filter?.merchantUrl || "") &&
          (filter?.state == null ||
            filter?.state === "all" ||
            pushPayment.state.toString() == filter?.state) &&
          dateUtils.checkTimestampInRang(
            pushPayment.createdTimestamp,
            dateUtils.fromDatetimeStringToTimestamp(
              filter?.createdTimestampFrom,
            ),
            dateUtils.fromDatetimeStringToTimestamp(filter?.createdTimestampTo),
          ) &&
          dateUtils.checkTimestampInRang(
            pushPayment.expirationDate,
            dateUtils.fromDatetimeStringToTimestamp(filter?.expirationDateFrom),
            dateUtils.fromDatetimeStringToTimestamp(filter?.expirationDateTo),
          )
        );
      });

      acc.push(...pushPayments);
      return acc;
    }, new Array<PushPayment>());
  };

  const getPullPayments = (): PullPayment[] => {
    return links.reduce((acc, link) => {
      const pullPayments = link.pullPayments.filter((pullPayment) => {
        return (
          pullPayment.id.includes(filter?.id || "") &&
          pullPayment.from.includes(filter?.from || "") &&
          pullPayment.to.includes(filter?.to || "") &&
          pullPayment.merchantUrl.includes(filter?.merchantUrl || "") &&
          (filter?.state == null ||
            filter?.state === "all" ||
            pullPayment.state.toString() == filter?.state) &&
          dateUtils.checkTimestampInRang(
            pullPayment.createdTimestamp,
            dateUtils.fromDatetimeStringToTimestamp(
              filter?.createdTimestampFrom,
            ),
            dateUtils.fromDatetimeStringToTimestamp(filter?.createdTimestampTo),
          ) &&
          dateUtils.checkTimestampInRang(
            pullPayment.expirationDate,
            dateUtils.fromDatetimeStringToTimestamp(filter?.expirationDateFrom),
            dateUtils.fromDatetimeStringToTimestamp(filter?.expirationDateTo),
          )
        );
      });

      acc.push(...pullPayments);
      return acc;
    }, new Array<PullPayment>());
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
          pushPayments={getPushPayments()}
          onAcceptPushPaymentClick={acceptPayment}
          onDisputePushPaymentClick={disputePayment}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <PullPaymentList
          publicIdentifier={publicIdentifier}
          pullPayments={getPullPayments()}
          onAcceptPullPaymentClick={acceptPayment}
          onDisputePullPaymentClick={disputePayment}
          onPullFundClick={pullFunds}
        />
      </TabPanel>
    </CustomBox>
  );
};

export default LinksWidget;
