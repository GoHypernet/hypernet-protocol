import React, { useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useStyles } from "@web-ui/components/GovernanceDialog/GovernanceDialog.style";

export interface GovernanceDialogProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  content?: React.ReactNode;
  onClose?: () => void;
}

export const GovernanceDialog: React.FC<GovernanceDialogProps> = (
  props: GovernanceDialogProps,
) => {
  const { title, description, content, isOpen, onClose } = props;
  const classes = useStyles({});
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
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>{content}</DialogContent>
    </Dialog>
  );
};
