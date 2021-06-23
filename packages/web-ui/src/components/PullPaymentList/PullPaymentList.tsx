import {
  PullPayment,
  PublicIdentifier,
  EPaymentState,
  PaymentId,
} from "@hypernetlabs/objects";
import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Collapse,
  List,
  ListItem,
  Typography,
  Divider,
  Button,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";
import { useStoreContext } from "@web-ui/contexts";
import React from "react";

interface IPullPaymentList {
  pullPayments: PullPayment[];
  publicIdentifier: PublicIdentifier;
  onAcceptPullPaymentClick: (paymentId: PaymentId) => void;
  onDisputePullPaymentClick: (paymentId: PaymentId) => void;
  onPullFundClick: (paymentId: PaymentId) => void;
}

interface IPullPaymentRow {
  pullPayment: PullPayment;
  acceptPaymentButtonVisible: boolean;
  pullFundsButtonVisible: boolean;
  disputeButtonVisible: boolean;
  onAcceptPullPaymentClick: (paymentId: PaymentId) => void;
  onDisputePullPaymentClick: (paymentId: PaymentId) => void;
  onPullFundClick: (paymentId: PaymentId) => void;
  publicIdentifier: PublicIdentifier;
}

const PullPaymentRow: React.FC<IPullPaymentRow> = (props: IPullPaymentRow) => {
  const {
    pullPayment,
    acceptPaymentButtonVisible,
    pullFundsButtonVisible,
    disputeButtonVisible,
    onAcceptPullPaymentClick,
    onDisputePullPaymentClick,
    onPullFundClick,
    publicIdentifier,
  } = props;
  const [open, setOpen] = React.useState(false);
  const { viewUtils, dateUtils } = useStoreContext();

  const StyledTableRow = withStyles((theme) => ({
    root: {
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
      },
      "& > *": {
        borderBottom: "unset",
      },
    },
  }))(TableRow);

  const renderListItem: (
    label: string,
    value: string | number,
    hideDivider?: boolean,
  ) => React.ReactNode = (label, value, hideDivider) => {
    return (
      <Box margin={2}>
        <ListItem>
          <Box display="flex" justifyContent="space-between" width="100%">
            <Typography style={{ fontWeight: 600, fontSize: 14 }}>
              {label}:
            </Typography>
            <Typography style={{ fontSize: 14 }}>{value}</Typography>
          </Box>
        </ListItem>
        {!hideDivider && <Divider />}
      </Box>
    );
  };

  return (
    <>
      <StyledTableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {pullPayment.merchantUrl}
        </TableCell>
        <TableCell align="right">
          {viewUtils.fromBigNumberWei(pullPayment.authorizedAmount)}
        </TableCell>
        <TableCell align="right">
          {viewUtils.fromBigNumberWei(pullPayment.requiredStake)}
        </TableCell>
        <TableCell align="right">
          {viewUtils.fromBigNumberWei(pullPayment.amountTransferred)}
        </TableCell>
        <TableCell align="right">
          {dateUtils.fromTimestampToUI(pullPayment.expirationDate)}
        </TableCell>
        <TableCell
          align="right"
          style={{
            color: viewUtils.fromPaymentStateColor(pullPayment.state),
          }}
        >
          {viewUtils.fromPaymentState(pullPayment.state)}
        </TableCell>
        <TableCell align="right">
          {acceptPaymentButtonVisible && (
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={() => onAcceptPullPaymentClick(pullPayment.id)}
            >
              Accept
            </Button>
          )}
          {disputeButtonVisible && (
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              onClick={() => onDisputePullPaymentClick(pullPayment.id)}
            >
              Dispute
            </Button>
          )}
          {pullFundsButtonVisible && (
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              onClick={() => onPullFundClick(pullPayment.id)}
            >
              Pull Funds
            </Button>
          )}
        </TableCell>
      </StyledTableRow>
      <TableCell
        style={{ paddingBottom: 0, paddingTop: 0, borderBottom: "none" }}
        colSpan={6}
      >
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box marginBottom={1}>
            <List dense={true}>
              {renderListItem("Payment ID", pullPayment.id)}
              {renderListItem(
                "From",
                `${pullPayment.from} ${
                  pullPayment.from === publicIdentifier ? "(You)" : ""
                }`,
              )}
              {renderListItem(
                "To",
                `${pullPayment.to} ${
                  pullPayment.to === publicIdentifier ? "(You)" : ""
                }`,
              )}
              {renderListItem(
                "State",
                viewUtils.fromPaymentState(pullPayment.state),
              )}
              {renderListItem("Payment Token", pullPayment.paymentToken)}
              {renderListItem(
                "Required Stake",
                viewUtils.fromBigNumberWei(pullPayment.requiredStake),
              )}
              {renderListItem(
                "Amount Staked	",
                viewUtils.fromBigNumberWei(pullPayment.amountStaked),
              )}
              {renderListItem(
                "Expiration Date",
                dateUtils.fromTimestampToUI(pullPayment.expirationDate),
              )}
              {renderListItem("Merchant URL", pullPayment.merchantUrl)}
              {renderListItem(
                "Authorized Amount",
                viewUtils.fromBigNumberWei(pullPayment.authorizedAmount),
                true,
              )}
            </List>
          </Box>
        </Collapse>
      </TableCell>
    </>
  );
};

export const PullPaymentList: React.FC<IPullPaymentList> = (
  props: IPullPaymentList,
) => {
  const {
    pullPayments,
    publicIdentifier,
    onAcceptPullPaymentClick,
    onDisputePullPaymentClick,
    onPullFundClick,
  } = props;

  return (
    <TableContainer>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Validator</TableCell>
            <TableCell align="right">Authorized Amount</TableCell>
            <TableCell align="right">Required Stake</TableCell>
            <TableCell align="right">Amount Staked</TableCell>
            <TableCell align="right">Expiration Date</TableCell>
            <TableCell align="right">State</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pullPayments.map((pullPayment) => (
            <PullPaymentRow
              key={pullPayment.id}
              pullPayment={pullPayment}
              publicIdentifier={publicIdentifier}
              acceptPaymentButtonVisible={
                pullPayment.state === EPaymentState.Proposed
              }
              pullFundsButtonVisible={
                publicIdentifier === pullPayment.to &&
                pullPayment.state === EPaymentState.Approved
              }
              disputeButtonVisible={
                publicIdentifier === pullPayment.from &&
                pullPayment.state === EPaymentState.Accepted
              }
              onAcceptPullPaymentClick={onAcceptPullPaymentClick}
              onDisputePullPaymentClick={onDisputePullPaymentClick}
              onPullFundClick={onPullFundClick}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
