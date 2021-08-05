import { Box } from "@material-ui/core";
import { useStyles } from "@web-ui/components/LoadingSpinner/LoadingSpinner.style";
import { useLayoutContext } from "@web-ui/contexts";
import React from "react";
import PuffLoader from "react-spinners/PuffLoader";

const LoadingSpinner: React.FC = () => {
  const { loading } = useLayoutContext();
  const classes = useStyles();

  return (
    <>
      {loading && (
        <Box className={classes.loadingWrapper}>
          <PuffLoader color={"#4dc1ab"} loading={loading} size={70} />
        </Box>
      )}
    </>
  );
};

export default LoadingSpinner;
