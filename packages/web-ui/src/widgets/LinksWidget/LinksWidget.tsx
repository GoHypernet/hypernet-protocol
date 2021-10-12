import { PushPayment, PullPayment } from "@hypernetlabs/objects";
import { Box, AppBar, Switch, Typography, Tooltip } from "@material-ui/core";
import {
  FilterList as FilterListIcon,
  Info as InfoIcon,
} from "@material-ui/icons";

import { useStoreContext } from "@web-ui/contexts";
import { IRenderParams } from "@web-ui/interfaces";
import React, { useState, useMemo } from "react";

import { useStyles } from "@web-ui/widgets/LinksWidget/LinksWidget.style";
import {
  PullPaymentList,
  PushPaymentList,
  GovernanceTabs,
  GovernanceTab,
  TabPanel,
  GovernanceCard,
  GovernanceSideFilter,
  IFilterItemNew,
  ESideFilterItemType,
  GovernanceButton,
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
  const classes = useStyles();
  const { viewUtils, dateUtils } = useStoreContext();
  const [tabValue, setTabValue] = useState<number>(0);
  const [isSideFilterOpen, setIsSideFilterOpen] = useState(false);
  const [filter, setFilter] = useState<ISideFilter>();
  const {
    links,
    publicIdentifier,
    acceptPayment,
    pullFunds,
    loading,
    paymentsAutoAccept,
    setPaymentsAutoAccept,
  } = useLinks();

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const linksFilter: IFilterItemNew[] = useMemo(
    () => [
      {
        label: "Search By Payment ID",
        widgetType: ESideFilterItemType.stringInput,
        stateKey: "id",
      },
      {
        label: "Search By From",
        widgetType: ESideFilterItemType.stringInput,
        stateKey: "from",
      },
      {
        label: "Search By To",
        widgetType: ESideFilterItemType.stringInput,
        stateKey: "to",
      },
      {
        label: "Search By Gateway URL",
        widgetType: ESideFilterItemType.stringInput,
        stateKey: "gatewayUrl",
      },
      {
        label: "Search By Payment State",
        widgetType: ESideFilterItemType.select,
        stateKey: "state",
        defaultValue: "all",
        widgetProps: {
          options: viewUtils.getPaymentStateOptions(),
        },
      },
      {
        label: "Search By created date",
        widgetType: ESideFilterItemType.dateTimeDifference,
        stateKey: "createdTimestamp",
      },
      {
        label: "Search By expiration date",
        widgetType: ESideFilterItemType.dateTimeDifference,
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

  return (
    <GovernanceCard
      title={
        <Box display="flex">
          <Typography variant="h5">Transaction History</Typography>
          <Box display="flex" alignItems="center" marginLeft="auto">
            <Box display="flex" alignItems="center" marginRight={1}>
              <Tooltip title="Enabling auto-accept will free you from manually approving every change to your Hypernet Protocol account.">
                <InfoIcon className={classes.infoIcon} />
              </Tooltip>
              <Typography variant="body2" className={classes.switchLabel}>
                Payments auto-accept
              </Typography>
              <Switch
                checked={paymentsAutoAccept}
                onChange={onPaymentsAutoAcceptChange}
                name="paymentsAutoAccept"
                color="primary"
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            </Box>
            <GovernanceButton
              size="small"
              onClick={() => setIsSideFilterOpen(true)}
              endIcon={<FilterListIcon />}
            >
              Filter
            </GovernanceButton>
          </Box>
        </Box>
      }
      description="Transactions associated with the currently selected Hypernet Protocol account."
    >
      <GovernanceSideFilter
        visible={isSideFilterOpen}
        onClose={() => setIsSideFilterOpen(false)}
        filterItems={linksFilter}
        onFilterSubmit={handleFilterSubmit}
      />
      <AppBar position="static" color="transparent" elevation={0}>
        <GovernanceTabs
          value={tabValue}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <GovernanceTab label="Push Payments" />
          <GovernanceTab label="Pull Payments" />
        </GovernanceTabs>
      </AppBar>
      <TabPanel value={tabValue} index={0}>
        <PushPaymentList
          publicIdentifier={publicIdentifier}
          pushPayments={getPushPayments()}
          onAcceptPushPaymentClick={acceptPayment}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <PullPaymentList
          publicIdentifier={publicIdentifier}
          pullPayments={getPullPayments()}
          onAcceptPullPaymentClick={acceptPayment}
          onPullFundClick={pullFunds}
        />
      </TabPanel>
    </GovernanceCard>
  );
};

export default LinksWidget;
