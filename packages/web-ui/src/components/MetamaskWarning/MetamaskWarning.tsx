import React from "react";
import { Box } from "@material-ui/core";

import { useStyles } from "@web-ui/components/MetamaskWarning/MetamaskWarning.style";

import { METAMASK_IMAGE_URL, METAMASK_URL } from "@web-ui/constants";
import { Button, ModalHeader } from "@web-ui/components";

export const MetamaskWarning: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <ModalHeader />
      <div className={classes.wrapper}>
        <Box className={classes.title}>
          Oops! <br /> Looks like you don't have metamask installed.
        </Box>

        <Box className={classes.metamaskImgWrapper}>
          <img className={classes.metamaskImg} src={METAMASK_IMAGE_URL} />
        </Box>

        <Button
          label="Install Metamask"
          onClick={() => {
            window.open(METAMASK_URL, "_blank");
          }}
          fullWidth={true}
          bgColor="linear-gradient(98deg, rgba(0,120,255,1) 0%, rgba(126,0,255,1) 100%)"
        />
      </div>
    </div>
  );
};
