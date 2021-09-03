import React from "react";

import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import { useCreateProposalContext } from "../CreateProposal.context";
import { EProposalAction } from "../CreateProposal.interface";
import { useStyles } from "./ProposalActionSelector.style";
import { Divider } from "@material-ui/core";


const ProposalActionSelector: React.FC = () => {
  const classes = useStyles();

  const {
    isProposalActionSelectorOpen,
    toggleProposalActionSelector,
    setProposalAction,
  } = useCreateProposalContext();

  const handleClose = () => {
    toggleProposalActionSelector();
  };

  const handleListItemClick = (value: string) => {
    setProposalAction(EProposalAction[value]);
    toggleProposalActionSelector();
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="proposal-action-modal-title"
      open={isProposalActionSelectorOpen}
      PaperProps={{
        className: classes.dialog,
      }}
    >
      <DialogTitle id="proposal-action-modal-title">
        Select an action
      </DialogTitle>
      <Divider />
      <List>
        {Object.keys(EProposalAction).map((action) => (
          <ListItem
            button
            onClick={() => handleListItemClick(action)}
            key={action}
          >
            <ListItemText primary={EProposalAction[action]} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
};

export default ProposalActionSelector;
