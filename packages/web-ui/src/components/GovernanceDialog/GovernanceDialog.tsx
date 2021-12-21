import React, { useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Divider,
  DialogProps,
} from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";

import { useStyles } from "@web-ui/components/GovernanceDialog/GovernanceDialog.style";

type DialogPropsExtracted = Omit<DialogProps, "title" | "open">;

export interface GovernanceDialogProps extends DialogPropsExtracted {
  isOpen: boolean;
  title?: string | React.ReactNode;
  description?: string;
  content?: React.ReactNode;
  onClose?: () => void;
  maxWidth?: DialogProps["maxWidth"];
}

export const GovernanceDialog: React.FC<GovernanceDialogProps> = (
  props: GovernanceDialogProps,
) => {
  const {
    title,
    description,
    content,
    isOpen,
    onClose,
    maxWidth = "sm",
    ...rest
  } = props;
  const classes = useStyles();
  const [isDialogOpen, setIsDialogOpen] = useState(isOpen);

  const toggleDialogOpen = () => {
    setIsDialogOpen((open) => !open);
  };

  return (
    <Dialog
      className={classes.dialog}
      open={isDialogOpen}
      onClose={() => {
        setIsDialogOpen(false);
        onClose && onClose();
      }}
      fullWidth
      maxWidth={maxWidth}
      onClick={(e) => {
        e.stopPropagation();
      }}
      {...rest}
    >
      <Box className={classes.dialogTitle}>
        {title}
        <IconButton
          aria-label="close"
          onClick={() => {
            setIsDialogOpen(false);
            onClose && onClose();
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <DialogContent className={classes.dialogContent}>{content}</DialogContent>
    </Dialog>
  );
};
