import {
  PushPayment,
  PublicIdentifier,
  PaymentId,
  EPaymentState,
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

interface IPushPaymentList {
  pushPayments: PushPayment[];
  publicIdentifier: PublicIdentifier;
  onAcceptPushPaymentClick: (paymentId: PaymentId) => void;
  onDisputePushPaymentClick: (paymentId: PaymentId) => void;
}

interface IPushPaymentRow {
  pushPayment: PushPayment;
  acceptPaymentButtonVisible: boolean;
  disputeButtonVisible: boolean;
  onAcceptPushPaymentClick: (paymentId: PaymentId) => void;
  onDisputePushPaymentClick: (paymentId: PaymentId) => void;
  publicIdentifier: PublicIdentifier;
}

const PushPaymentRow: React.FC<IPushPaymentRow> = (props: IPushPaymentRow) => {
  const {
    pushPayment,
    acceptPaymentButtonVisible,
    disputeButtonVisible,
    onAcceptPushPaymentClick,
    onDisputePushPaymentClick,
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
          {pushPayment.gatewayUrl}
        </TableCell>
        <TableCell align="right">
          {viewUtils.fromBigNumberWei(pushPayment.paymentAmount)}
        </TableCell>
        <TableCell align="right">
          {viewUtils.fromBigNumberWei(pushPayment.requiredStake)}
        </TableCell>
        <TableCell align="right">
          {viewUtils.fromBigNumberWei(pushPayment.amountStaked)}
        </TableCell>
        <TableCell align="right">
          {dateUtils.fromTimestampToUI(pushPayment.createdTimestamp)}
        </TableCell>
        <TableCell align="right">
          {dateUtils.fromTimestampToUI(pushPayment.expirationDate)}
        </TableCell>
        <TableCell
          align="right"
          style={{
            color: viewUtils.fromPaymentStateColor(pushPayment.state),
          }}
        >
          {viewUtils.fromPaymentState(pushPayment.state)}
        </TableCell>
        <TableCell align="right">
          {acceptPaymentButtonVisible && (
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={() => onAcceptPushPaymentClick(pushPayment.id)}
            >
              Accept
            </Button>
          )}
          {disputeButtonVisible && (
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              onClick={() => onDisputePushPaymentClick(pushPayment.id)}
            >
              Dispute
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
              {renderListItem("Payment ID", pushPayment.id)}
              {renderListItem(
                "From",
                `${pushPayment.from} ${
                  pushPayment.from === publicIdentifier ? "(You)" : ""
                }`,
              )}
              {renderListItem(
                "To",
                `${pushPayment.to} ${
                  pushPayment.to === publicIdentifier ? "(You)" : ""
                }`,
              )}
              {renderListItem(
                "State",
                viewUtils.fromPaymentState(pushPayment.state),
              )}
              {renderListItem("Payment Token", pushPayment.paymentToken)}
              {renderListItem(
                "Required Stake",
                viewUtils.fromBigNumberWei(pushPayment.requiredStake),
              )}
              {renderListItem(
                "Amount Staked	",
                viewUtils.fromBigNumberWei(pushPayment.amountStaked),
              )}
              {renderListItem(
                "Expiration Date",
                dateUtils.fromTimestampToUI(pushPayment.expirationDate),
              )}
              {renderListItem(
                "Created",
                dateUtils.fromTimestampToUI(pushPayment.createdTimestamp),
              )}
              {renderListItem(
                "Updated",
                dateUtils.fromTimestampToUI(pushPayment.updatedTimestamp),
              )}
              {renderListItem("Gateway URL", pushPayment.gatewayUrl)}
              {renderListItem(
                "Payment Amount",
                viewUtils.fromBigNumberWei(pushPayment.paymentAmount),
                true,
              )}
            </List>
          </Box>
        </Collapse>
      </TableCell>
    </>
  );
};

export const PushPaymentList: React.FC<IPushPaymentList> = (
  props: IPushPaymentList,
) => {
  const {
    pushPayments,
    publicIdentifier,
    onAcceptPushPaymentClick,
    onDisputePushPaymentClick,
  } = props;

  return (
    <TableContainer>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Gateway</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Required Stake</TableCell>
            <TableCell align="right">Amount Staked</TableCell>
            <TableCell align="right">Created Date</TableCell>
            <TableCell align="right">Expiration Date</TableCell>
            <TableCell align="right">State</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pushPayments.map((pushPayment) => (
            <PushPaymentRow
              key={pushPayment.id}
              pushPayment={pushPayment}
              publicIdentifier={publicIdentifier}
              acceptPaymentButtonVisible={
                publicIdentifier === pushPayment.to &&
                pushPayment.state === EPaymentState.Proposed
              }
              disputeButtonVisible={
                publicIdentifier === pushPayment.from &&
                pushPayment.state === EPaymentState.Accepted
              }
              onAcceptPushPaymentClick={onAcceptPushPaymentClick}
              onDisputePushPaymentClick={onDisputePushPaymentClick}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
