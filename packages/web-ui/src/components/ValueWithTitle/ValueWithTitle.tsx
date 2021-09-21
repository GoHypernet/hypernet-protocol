import React, { Fragment, useEffect, useState } from "react";
import { Box, IconButton, Tooltip, Typography } from "@material-ui/core";

import FileCopyIcon from "@material-ui/icons/FileCopy";
import EditIcon from "@material-ui/icons/Edit";

import { useStyles } from "@web-ui/components/ValueWithTitle/ValueWithTitle.style";

export interface IValueWithTitle {
  title: string;
  value: string | number;
  titleRightContent?: React.ReactNode;
  valueRightContent?: React.ReactNode;
  onEditClick?: Function;
  showCopy?: boolean;
}

export const ValueWithTitle: React.FC<IValueWithTitle> = (
  props: IValueWithTitle,
) => {
  const {
    title,
    value,
    titleRightContent,
    valueRightContent,
    onEditClick,
    showCopy,
  } = props;
  const classes = useStyles({});
  const [isCopyTooltipOpen, setIsCopyTooltipOpen] = useState(false);

  useEffect(() => {
    const toggleCopyTooltip = setInterval(() => {
      if (isCopyTooltipOpen) {
        setIsCopyTooltipOpen(false);
      }
    }, 2000);

    return () => clearInterval(toggleCopyTooltip);
  }, [isCopyTooltipOpen, useState]);

  const copyValueToClipboard = () => {
    navigator.clipboard.writeText(`${value}`);
    setIsCopyTooltipOpen(true);
  };

  return (
    <Box className={classes.wrapper}>
      <Box className={classes.rowWrapper}>
        <Typography variant="h6" color="textPrimary" className={classes.title}>
          {title}
        </Typography>
        {titleRightContent}
      </Box>

      <Box className={classes.rowWrapper}>
        <Typography
          variant="body2"
          color="textPrimary"
          className={classes.value}
        >
          {value}
        </Typography>

        <Box className={classes.rightContent}>
          {valueRightContent}
          {showCopy && (
            <Tooltip
              open={isCopyTooltipOpen}
              title="Copied!"
              arrow
              placement="top"
            >
              <IconButton
                className={classes.iconButton}
                onClick={copyValueToClipboard}
              >
                <FileCopyIcon />
              </IconButton>
            </Tooltip>
          )}
          {onEditClick && (
            <IconButton
              className={classes.iconButton}
              onClick={() => {
                onEditClick();
              }}
            >
              <EditIcon />
            </IconButton>
          )}
        </Box>
      </Box>
    </Box>
  );
};
