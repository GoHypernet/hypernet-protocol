import React, { useMemo } from "react";
import { Pagination, PaginationProps } from "@material-ui/lab";
import { useStyles } from "@web-ui/components/GovernancePagination/GovernancePagination.style";
import { defaultWidgetUniqueIdentifier } from "@web-ui/theme";

interface CustomPageProps {
  itemsPerPage: number;
  totalItems: number;
  currentPageStartIndex?: number;
}

interface GovernancePaginationProps extends PaginationProps {
  customPageOptions?: CustomPageProps;
  widgetUniqueIdentifier?: string;
}

export const getPageItemIndexList = (
  totalItems: number,
  currentPage: number,
  itemsPerPage: number,
): number[] => {
  const proposalNumberArr: number[] = [];
  if (totalItems) {
    for (let i = 1; i <= Math.min(totalItems, itemsPerPage); i++) {
      // Get indices from current page backwards.
      const index = totalItems - (currentPage - 1) * itemsPerPage - i + 1;
      // Proposals starts with index one.
      if (index > 0) {
        proposalNumberArr.push(index);
      }
    }
  }
  return proposalNumberArr;
};

export const GovernancePagination: React.FC<GovernancePaginationProps> = (
  props: GovernancePaginationProps,
) => {
  const {
    shape = "rounded",
    customPageOptions,
    count = 1,
    defaultPage = 1,
    widgetUniqueIdentifier = defaultWidgetUniqueIdentifier,
    ...rest
  } = props;
  const classes = useStyles({ widgetUniqueIdentifier });

  const customPageCount = useMemo(() => {
    if (!customPageOptions) {
      return 0;
    }

    return Math.ceil(
      customPageOptions.totalItems / customPageOptions.itemsPerPage,
    );
  }, [JSON.stringify(customPageOptions)]);

  const customDefaultPage = useMemo(() => {
    if (!customPageOptions || !customPageOptions?.currentPageStartIndex) {
      return 0;
    }

    return Math.ceil(
      customPageOptions.currentPageStartIndex / customPageOptions.itemsPerPage,
    );
  }, [JSON.stringify(customPageOptions)]);

  return (
    <Pagination
      className={classes.pagination}
      shape={shape}
      count={customPageOptions ? customPageCount : count}
      {...rest}
      defaultPage={
        customPageOptions?.currentPageStartIndex
          ? customDefaultPage
          : defaultPage
      }
    />
  );
};
