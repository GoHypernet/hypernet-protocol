import React from "react";
import PuffLoader from "react-spinners/PuffLoader";

import useStyles from "@user-dashboard/components/LoadingSpinner/LoadingSpinner.style";
import { useLayoutContext } from "@user-dashboard/contexts";

const LoadingSpinner: React.FC = () => {
  const { loading } = useLayoutContext();
  const classes = useStyles();

  return (
    <>
      {loading && (
        <div className={classes.loadingWrapper}>
          <PuffLoader color={"#4dc1ab"} loading={loading} size={70} />
        </div>
      )}
    </>
  );
};

export default LoadingSpinner;
