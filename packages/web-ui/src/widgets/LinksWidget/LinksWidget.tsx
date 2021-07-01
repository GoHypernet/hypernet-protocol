import { PushPayment, PullPayment } from "@hypernetlabs/objects";
import { Box, AppBar, IconButton, Switch, Typography } from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import { useStoreContext } from "@web-ui/contexts";
import { IFilterItem, EItemType, IRenderParams } from "@web-ui/interfaces";
import React, { useState, useMemo } from "react";

import {
  PullPaymentList,
  PushPaymentList,
  AntTabs,
  AntTab,
  TabPanel,
  SideFilter,
  BoxWrapper,
  EmptyState,
} from "@web-ui/components";
import { useLinks } from "@web-ui/hooks";

interface ILinksWidget extends IRenderParams {}

interface ISideFilter {
  id: string;
  from: string;
  to: string;
  gatewayUrl: string;
  state: string;
  createdTimestampFrom: string;
  createdTimestampTo: string;
  expirationDateFrom: string;
  expirationDateTo: string;
}

const LinksWidget: React.FC<ILinksWidget> = ({
  noLabel,
  includeBoxWrapper,
  bodyStyle,
}: ILinksWidget) => {
  const { viewUtils, dateUtils } = useStoreContext();
  const [tabValue, setTabValue] = useState<number>(0);
  const [isSideFilterOpen, setIsSideFilterOpen] = useState(false);
  const [filter, setFilter] = useState<ISideFilter>();
  const {
    links,
    publicIdentifier,
    acceptPayment,
    disputePayment,
    pullFunds,
    loading,
    paymentsAutoAccept,
    setPaymentsAutoAccept,
  } = useLinks();

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
        label: "Search By Gateway URL",
        widgetType: EItemType.stringInput,
        stateKey: "gatewayUrl",
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
      },
      {
        label: "Search By expiration date",
        widgetType: EItemType.dateTimeDifference,
        stateKey: "expirationDate",
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
          pushPayment.gatewayUrl.includes(filter?.gatewayUrl || "") &&
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
          pullPayment.gatewayUrl.includes(filter?.gatewayUrl || "") &&
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

  const onPaymentsAutoAcceptChange = (event) => {
    setPaymentsAutoAccept(event.target.checked);
  };

  const CustomBox = includeBoxWrapper ? BoxWrapper : Box;

  return (
    <CustomBox
      label={!noLabel ? "TRANSACTION HISTORY" : undefined}
      rightComponent={
        <Box display="flex" alignItems="center">
          <Box display="flex" alignItems="center" marginRight={1}>
            <Box marginRight={1} color="#0000008a">
              Payments auto accept
            </Box>
            <Switch
              checked={paymentsAutoAccept}
              onChange={onPaymentsAutoAcceptChange}
              name="paymentsAutoAccept"
              color="primary"
              inputProps={{ "aria-label": "primary checkbox" }}
            />
          </Box>
          <IconButton
            aria-label="list"
            onClick={() => setIsSideFilterOpen(true)}
            style={{ height: 30, display: "flex", fontSize: 18 }}
          >
            <Box marginRight={1}>Filter</Box>
            <FilterListIcon />
          </IconButton>
        </Box>
      }
      bodyStyle={bodyStyle}
      hasEmptyState={links.length === 0 && !loading}
      emptyState={<EmptyState info={<>You don't have any payments yet.</>} />}
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
