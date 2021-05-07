import React from "react";

import useStyles from "@web-ui/components/SucessContent/SucessContent.style";
import { Button } from "@web-ui/components";

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
    <div className={classes.container}>
      <img
        className={classes.successImage}
        src="https://res.cloudinary.com/dqueufbs7/image/upload/v1620338380/images/success-icon-23194.png"
      />
      <div className={classes.textWrapper}>
        <div className={classes.label}>{label}</div>
        {info && (
          <div
            className={classes.info}
            dangerouslySetInnerHTML={{ __html: info }}
          ></div>
        )}
      </div>
      {onOkay && (
        <Button onClick={onOkay} fullWidth hasMaterialUIStyle label="OKAY" />
      )}
    </div>
  );
};
