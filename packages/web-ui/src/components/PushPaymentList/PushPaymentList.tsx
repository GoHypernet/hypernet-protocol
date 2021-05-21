import { PushPayment } from "@hypernetlabs/objects";
import React from "react";
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
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";
import { useStoreContext } from "@web-ui/contexts";

interface IPushPaymentList {
  pushPayments: PushPayment[];
}

interface IPushPaymentRow {
  pushPayment: PushPayment;
}

const PushPaymentRow: React.FC<IPushPaymentRow> = (props: IPushPaymentRow) => {
  const { pushPayment } = props;
  const [open, setOpen] = React.useState(false);
  const { viewUtils } = useStoreContext();

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
          {pushPayment.merchantUrl}
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
        <TableCell align="right">{pushPayment.expirationDate}</TableCell>
        <TableCell
          align="right"
          style={{
            color: viewUtils.fromPaymentStateColor(pushPayment.state),
          }}
        >
          {viewUtils.fromPaymentState(pushPayment.state)}
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
              {renderListItem("From", pushPayment.from)}
              {renderListItem("To", pushPayment.to)}
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
              {renderListItem("Expiration Date", pushPayment.expirationDate)}
              {renderListItem("Created", pushPayment.createdTimestamp)}
              {renderListItem("Updated", pushPayment.updatedTimestamp)}
              {renderListItem("Merchant URL", pushPayment.merchantUrl)}
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
  const { pushPayments } = props;
  console.log("pushPayments: ", pushPayments);

  return (
    <TableContainer>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Validator</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Required Stake</TableCell>
            <TableCell align="right">Amount Staked</TableCell>
            <TableCell align="right">Expiration Date</TableCell>
            <TableCell align="right">State</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pushPayments.map((pushPayment) => (
            <PushPaymentRow key={pushPayment.id} pushPayment={pushPayment} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
