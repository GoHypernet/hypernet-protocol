import React from "react";
import { Box } from "@material-ui/core";

import { INSECURE_CONTENT_IMAGE_URL } from "@web-ui/constants";
import { useStyles } from "@web-ui/components/WarningAlert/WarningAlert.style";

interface IWarningAlert {
  errorMessage?: string;
}

export const WarningAlert: React.FC<IWarningAlert> = (props: IWarningAlert) => {
  const { errorMessage } = props;
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        {errorMessage && <Box className={classes.title}>{errorMessage}</Box>}
        <Box className={classes.title}>
          Make sure to allow insecure content at the bottom of the site settings
          page.
        </Box>

        <Box className={classes.insecureConentWrapper}>
          <img
            className={classes.insecureConent}
            src={INSECURE_CONTENT_IMAGE_URL}
          />
        </Box>
      </div>
    </div>
  );
};
