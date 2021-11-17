import {
  PullPayment,
  PublicIdentifier,
  EPaymentState,
  PaymentId,
} from "@hypernetlabs/objects";
import { useStoreContext } from "@web-ui/contexts";
import React, { useMemo, useState } from "react";
import {
  GovernanceTable,
  ITableCell,
  GovernanceTag,
  ETagColor,
  GovernanceButton,
  GovernanceEmptyState,
  GovernancePagination,
  extractDataByPage,
} from "@web-ui/components";
import { useLinks } from "@web-ui/hooks";
import { useStyles } from "@web-ui/components/PullPaymentList/PullPaymentList.style";

interface IPullPaymentList {
  pullPayments: PullPayment[];
  publicIdentifier: PublicIdentifier;
  onAcceptPullPaymentClick: (paymentId: PaymentId) => void;
  onPullFundClick: (paymentId: PaymentId) => void;
}

const PULL_PAYMENTS_PER_PAGE = 5;

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

export const PullPaymentList: React.FC<IPullPaymentList> = (
  props: IPullPaymentList,
) => {
  const {
    pullPayments,
    publicIdentifier,
    onAcceptPullPaymentClick,
    onPullFundClick,
  } = props;
  const classes = useStyles();
  const { viewUtils, dateUtils } = useStoreContext();
  const { loading } = useLinks();
  const [page, setPage] = useState<number>(1);

  const initialValue: ITableCell[][] = [];

  const paginatedPullPayments = useMemo<PullPayment[]>(
    () => extractDataByPage(pullPayments, PULL_PAYMENTS_PER_PAGE, page),
    [JSON.stringify(pullPayments), page],
  );

  const rows = useMemo(
    () =>
      paginatedPullPayments.reduce((acc, item) => {
        acc.push([
          {
            cellValue: item.gatewayUrl,
            tableCellProps: {
              align: "left",
            },
          },
          {
            cellValue: viewUtils.convertToEther(item.authorizedAmount),
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
            cellValue: item.from,
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
                {item.state === EPaymentState.Proposed && (
                  <GovernanceButton
                    size="small"
                    variant="outlined"
                    color="primary"
                    onClick={() => onAcceptPullPaymentClick(item.id)}
                  >
                    Accept
                  </GovernanceButton>
                )}
                {publicIdentifier === item.to &&
                  item.state === EPaymentState.Approved && (
                    <GovernanceButton
                      size="small"
                      variant="outlined"
                      color="secondary"
                      onClick={() => onPullFundClick(item.id)}
                    >
                      Pull Funds
                    </GovernanceButton>
                  )}
              </>
            ),
            tableCellProps: {
              align: "left",
            },
          },
        ]);
        return acc;
      }, initialValue),
    [JSON.stringify(paginatedPullPayments)],
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
      {pullPayments.length > 0 && (
        <GovernancePagination
          className={classes.pagination}
          customPageOptions={{
            itemsPerPage: PULL_PAYMENTS_PER_PAGE,
            totalItems: pullPayments.length,
          }}
          onChange={(_, page) => {
            setPage(page);
          }}
        />
      )}
    </>
  );
};
