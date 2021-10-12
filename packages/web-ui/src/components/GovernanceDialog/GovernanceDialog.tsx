import React, { useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Divider,
} from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";

import { useStyles } from "@web-ui/components/GovernanceDialog/GovernanceDialog.style";
import { defaultWidgetUniqueIdentifier } from "@web-ui/theme";

export interface GovernanceDialogProps {
  isOpen: boolean;
  title?: string | React.ReactNode;
  description?: string;
  content?: React.ReactNode;
  onClose?: () => void;
  widgetUniqueIdentifier?: string;
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
    widgetUniqueIdentifier = defaultWidgetUniqueIdentifier,
  } = props;
  const classes = useStyles({ widgetUniqueIdentifier });
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
      maxWidth="sm"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <DialogTitle>
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
      </DialogTitle>
      <Divider />
      <DialogContent className={classes.dialogContent}>{content}</DialogContent>
    </Dialog>
  );
};
