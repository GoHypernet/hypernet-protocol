import {
  PushPayment,
  PublicIdentifier,
  PaymentId,
  EPaymentState,
} from "@hypernetlabs/objects";
import { useStoreContext } from "@web-ui/contexts";
import {
  GovernanceTable,
  ITableCell,
  GovernanceTag,
  ETagColor,
  GovernanceButton,
} from "@web-ui/components";
import React, { useMemo } from "react";

interface IPushPaymentList {
  pushPayments: PushPayment[];
  publicIdentifier: PublicIdentifier;
  onAcceptPushPaymentClick: (paymentId: PaymentId) => void;
}

const tableColumns: ITableCell[] = [
  {
    cellValue: "Gateway",
    tableCellProps: {
      align: "left",
    },
  },
  {
    cellValue: "Payment Amount",
    tableCellProps: {
      align: "left",
    },
  },
  {
    cellValue: "Amount",
    tableCellProps: {
      align: "left",
    },
  },
  {
    cellValue: "Created",
    tableCellProps: {
      align: "left",
    },
  },
  {
    cellValue: "State",
    tableCellProps: {
      align: "left",
    },
  },
  {
    cellValue: "Payment ID",
    tableCellProps: {
      align: "left",
    },
    onlyVisibleInExpandedState: true,
  },
  {
    cellValue: "From",
    tableCellProps: {
      align: "left",
    },
    onlyVisibleInExpandedState: true,
  },
  {
    cellValue: "To",
    tableCellProps: {
      align: "left",
    },
    onlyVisibleInExpandedState: true,
  },
  {
    cellValue: "Payment Token",
    tableCellProps: {
      align: "left",
    },
    onlyVisibleInExpandedState: true,
  },
  {
    cellValue: "Required Stake",
    tableCellProps: {
      align: "left",
    },
    onlyVisibleInExpandedState: true,
  },

  {
    cellValue: "Amount Staked",
    tableCellProps: {
      align: "left",
    },
    onlyVisibleInExpandedState: true,
  },
  {
    cellValue: "Expiration Date",
    tableCellProps: {
      align: "left",
    },
    onlyVisibleInExpandedState: true,
  },
  {
    cellValue: "Updated",
    tableCellProps: {
      align: "left",
    },
    onlyVisibleInExpandedState: true,
  },
  {
    cellValue: "Action",
    mobileCellValue: " ",
    tableCellProps: {
      align: "left",
    },
  },
];

export const PushPaymentList: React.FC<IPushPaymentList> = (
  props: IPushPaymentList,
) => {
  const { pushPayments, publicIdentifier, onAcceptPushPaymentClick } = props;
  const { viewUtils, dateUtils } = useStoreContext();

  const initialValue: ITableCell[][] = [];
  const rows = useMemo(
    () =>
      pushPayments.reduce((acc, item) => {
        acc.push([
          {
            cellValue: item.gatewayUrl,
            tableCellProps: {
              align: "left",
            },
          },
          {
            cellValue: item.paymentAmount,
            tableCellProps: {
              align: "left",
            },
          },
          {
            cellValue: dateUtils.fromTimestampToUI(item.createdTimestamp),
            tableCellProps: {
              align: "left",
            },
          },
          {
            cellValue: (
              <GovernanceTag
                text={viewUtils.fromPaymentState(item.state)}
                color={ETagColor.BLUE}
              />
            ),
            tableCellProps: {
              align: "left",
            },
          },
          {
            cellValue: viewUtils.fromBigNumberWei(item.paymentAmount),
            tableCellProps: {
              align: "left",
            },
          },
          {
            cellValue: item.id,
            tableCellProps: {
              align: "left",
            },
            onlyVisibleInExpandedState: true,
          },
          {
            cellValue: `${item.to} ${
              item.to === publicIdentifier ? "(You)" : ""
            }`,
            tableCellProps: {
              align: "left",
            },
            onlyVisibleInExpandedState: true,
          },
          {
            cellValue: item.to,
            tableCellProps: {
              align: "left",
            },
            onlyVisibleInExpandedState: true,
          },
          {
            cellValue: item.paymentToken,
            tableCellProps: {
              align: "left",
            },
            onlyVisibleInExpandedState: true,
          },
          {
            cellValue: viewUtils.fromBigNumberWei(item.requiredStake),
            tableCellProps: {
              align: "left",
            },
            onlyVisibleInExpandedState: true,
          },
          {
            cellValue: viewUtils.fromBigNumberWei(item.amountStaked),
            tableCellProps: {
              align: "left",
            },
            onlyVisibleInExpandedState: true,
          },
          {
            cellValue: dateUtils.fromTimestampToUI(item.expirationDate),
            tableCellProps: {
              align: "left",
            },
            onlyVisibleInExpandedState: true,
          },
          {
            cellValue: dateUtils.fromTimestampToUI(item.updatedTimestamp),
            tableCellProps: {
              align: "left",
            },
            onlyVisibleInExpandedState: true,
          },
          {
            cellValue: publicIdentifier === item.to &&
              item.state === EPaymentState.Proposed && (
                <GovernanceButton
                  size="small"
                  variant="outlined"
                  color="primary"
                  onClick={() => onAcceptPushPaymentClick(item.id)}
                >
                  Accept
                </GovernanceButton>
              ),
            tableCellProps: {
              align: "right",
            },
          },
        ]);
        return acc;
      }, initialValue),
    [JSON.stringify(pushPayments)],
  );

  return <GovernanceTable isExpandable columns={tableColumns} rows={rows} />;
};
