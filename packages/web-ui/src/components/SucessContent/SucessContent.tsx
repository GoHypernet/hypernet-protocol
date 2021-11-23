import { Box } from "@material-ui/core";
import React from "react";

import { Button } from "@web-ui/components";
import { useStyles } from "@web-ui/components/SucessContent/SucessContent.style";
import { AUTHENTICATION_SUCCESS_IMAGE_URL } from "@web-ui/constants";

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
      <Box className={classes.textWrapper}>
        <Box className={classes.label}>{label}</Box>
        {info && (
          <Box
            className={classes.info}
            dangerouslySetInnerHTML={{ __html: info }}
          ></Box>
        )}
        <Box>
          <img
            className={classes.authenticationSuccessImg}
            src={AUTHENTICATION_SUCCESS_IMAGE_URL}
          />
        </Box>
      </Box>
      {onOkay && (
        <Box className={classes.buttonWrapper}>
          <Button
            label="Done"
            onClick={onOkay}
            fullWidth={true}
            bgColor="linear-gradient(98deg, rgba(0,120,255,1) 0%, rgba(126,0,255,1) 100%)"
          />
        </Box>
      )}
    </Box>
  );
};
