import React from "react";

import useStyles from "./SucessContent.style";

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
        width="150"
        src="https://res.cloudinary.com/dqueufbs7/image/upload/v1614379253/images/Screen_Shot_2021-02-27_at_01.40.43.png"
      />
      <div className={classes.rightWrapper}>
        <div className={classes.textWrapper}>
          <div className={classes.label}>{label}</div>
          {info && <div className={classes.info}>{info}</div>}
        </div>
        {onOkay && (
          <div className={classes.buttonWrapper}>
            <button className={classes.button} onClick={onOkay}>
              OKAY
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
