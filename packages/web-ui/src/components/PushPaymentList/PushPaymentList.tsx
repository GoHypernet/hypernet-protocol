import {
  PushPayment,
  PublicIdentifier,
  PaymentId,
  EPaymentState,
  TokenInformation,
} from "@hypernetlabs/objects";
import { useStoreContext } from "@web-ui/contexts";
import {
  GovernanceTable,
  ITableCell,
  GovernanceTag,
  ETagColor,
  GovernanceButton,
  GovernanceEmptyState,
  GovernancePagination,
  extractDataByPage,
  GovernancePaymentTokenCell,
} from "@web-ui/components";
import React, { useMemo, useState } from "react";
import { useLinks } from "@web-ui/hooks";
import { useStyles } from "@web-ui/components/PushPaymentList/PushPaymentList.style";

interface IPushPaymentList {
  pushPayments: PushPayment[];
  publicIdentifier: PublicIdentifier;
  tokenInformationList: TokenInformation[];
  onAcceptPushPaymentClick: (paymentId: PaymentId) => void;
  onRepairPaymentClick: (paymentId: PaymentId) => void;
}

const PUSH_PAYMENTS_PER_PAGE = 5;

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
  const {
    pushPayments,
    publicIdentifier,
    tokenInformationList,
    onAcceptPushPaymentClick,
    onRepairPaymentClick,
  } = props;
  const classes = useStyles();
  const { viewUtils, dateUtils } = useStoreContext();
  const { loading } = useLinks();
  const [page, setPage] = useState<number>(1);

  const initialValue: ITableCell[][] = [];

  const paginatedPushPayments = useMemo<PushPayment[]>(
    () => extractDataByPage(pushPayments, PUSH_PAYMENTS_PER_PAGE, page),
    [JSON.stringify(pushPayments), page],
  );

  const rows = useMemo(
    () =>
      paginatedPushPayments.reduce((acc, item) => {
        acc.push([
          {
            cellValue: item.gatewayUrl,
            tableCellProps: {
              align: "left",
            },
          },
          {
            cellValue: viewUtils.convertToEther(item.paymentAmount),
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
            cellValue: item.id,
            tableCellProps: {
              align: "left",
            },
            onlyVisibleInExpandedState: true,
          },
          {
            cellValue: `${item.from} ${
              item.from === publicIdentifier ? "(You)" : ""
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
            cellValue: (
              <GovernancePaymentTokenCell
                paymentTokenAddress={item.paymentToken}
                tokenInformationList={tokenInformationList}
              />
            ),
            tableCellProps: {
              align: "left",
            },
            onlyVisibleInExpandedState: true,
          },
          {
            cellValue: viewUtils.convertToEther(item.requiredStake),
            tableCellProps: {
              align: "left",
            },
            onlyVisibleInExpandedState: true,
          },
          {
            cellValue: viewUtils.convertToEther(item.amountStaked),
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
            cellValue: (
              <>
                {item.state !== EPaymentState.Finalized && (
                  <GovernanceButton
                    size="small"
                    variant="outlined"
                    color="primary"
                    className={classes.actionButton}
                    onClick={() => onRepairPaymentClick(item.id)}
                  >
                    Repair
                  </GovernanceButton>
                )}
                {publicIdentifier === item.to &&
                  item.state === EPaymentState.Proposed && (
                    <GovernanceButton
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={() => onAcceptPushPaymentClick(item.id)}
                    >
                      Accept
                    </GovernanceButton>
                  )}
              </>
            ),
            tableCellProps: {
              align: "right",
            },
          },
        ]);
        return acc;
      }, initialValue),
    [
      JSON.stringify(paginatedPushPayments),
      JSON.stringify(tokenInformationList),
    ],
  );

  if (!loading && !rows.length) {
    return (
      <GovernanceEmptyState
        title="No results!"
        description="You don’t have any payments yet."
      />
    );
  }

  return (
    <>
      <GovernanceTable isExpandable columns={tableColumns} rows={rows} />
      {pushPayments.length > 0 && (
        <GovernancePagination
          className={classes.pagination}
          customPageOptions={{
            itemsPerPage: PUSH_PAYMENTS_PER_PAGE,
            totalItems: pushPayments.length,
          }}
          onChange={(_, page) => {
            setPage(page);
          }}
        />
      )}
    </>
  );
};
