import { Box } from "@material-ui/core";
import React from "react";

import { Button } from "@web-ui/components";
import { useStyles } from "@web-ui/components/SucessContent/SucessContent.style";

interface ISucessContentProps {
  label?: string;
  info?: string;
  onOkay?: () => void;
}

export const SucessContent: React.FC<ISucessContentProps> = (
  props: ISucessContentProps,
) => {
  const { label = "SUCCESS!", info, onOkay } = props;
  const classes = useStyles();
  return (
    <Box className={classes.container}>
      <img
        className={classes.successImage}
        src="https://res.cloudinary.com/dqueufbs7/image/upload/v1620338380/images/success-icon-23194.png"
      />
      <Box className={classes.textWrapper}>
        <Box className={classes.label}>{label}</Box>
        {info && (
          <Box
            className={classes.info}
            dangerouslySetInnerHTML={{ __html: info }}
          ></Box>
        )}
      </Box>
      {onOkay && (
        <Button onClick={onOkay} fullWidth hasMaterialUIStyle label="OKAY" />
      )}
    </Box>
  );
};
