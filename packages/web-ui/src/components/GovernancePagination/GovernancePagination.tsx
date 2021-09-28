import React, { useMemo } from "react";
import Pagination, { PaginationProps } from "@material-ui/lab/Pagination";
import { useStyles } from "@web-ui/components/GovernancePagination/GovernancePagination.style";

interface CustomPageProps {
  itemsPerPage: number;
  totalItems: number;
  currentPageStartIndex?: number;
}

interface GovernancePaginationProps extends PaginationProps {
  customPageOptions?: CustomPageProps;
}

export const GovernancePagination: React.FC<GovernancePaginationProps> = (
  props: GovernancePaginationProps,
) => {
  const {
    shape = "rounded",
    customPageOptions,
    count = 1,
    defaultPage = 1,
  } = props;
  const classes = useStyles();

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
    <>
      <Pagination
        className={classes.pagination}
        shape={shape}
        count={customPageOptions ? customPageCount : count}
        defaultPage={
          customPageOptions?.currentPageStartIndex
            ? customDefaultPage
            : defaultPage
        }
      />
    </>
  );
};
