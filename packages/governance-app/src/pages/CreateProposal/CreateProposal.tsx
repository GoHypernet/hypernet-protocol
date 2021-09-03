import React from "react";

import PageWrapper from "@governance-app/components/PageWrapper";
import {
  Box,
  Button,
  Card,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import { useStyles } from "./CreateProposal.style";
import {
  CreateProposalProvider,
  useCreateProposalContext,
} from "./CreateProposal.context";
import ProposalActionSelector from "./ProposalActionSelector/ProposalActionSelector";
import { useHistory } from "react-router-dom";

const ItemContainer = (props: { children: React.ReactNode; label: string }) => {
  const { children, label } = props;
  return (
    <Card
      style={{ borderRadius: 20, padding: 20, marginTop: 12 }}
      elevation={0}
    >
      <Typography style={{ marginBottom: 8 }}>{label}</Typography>
      {children}
    </Card>
  );
};

const ProposedActionItem = () => {
  const {
    toggleProposalActionSelector,
    selectedProposalAction,
  } = useCreateProposalContext();

  const handleProposedActionClick = () => {
    toggleProposalActionSelector();
  };
  return (
    <ItemContainer label="Proposed Action">
      <Select
        value={selectedProposalAction}
        open={false}
        fullWidth
        onClick={handleProposedActionClick}
        style={{ marginTop: 4 }}
        disableUnderline
      >
        <MenuItem value={selectedProposalAction}>
          {selectedProposalAction}
        </MenuItem>
      </Select>
      <ProposalActionSelector />
    </ItemContainer>
  );
};
const CreateProposal: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();

  const handleBackIconClick = () => {
    history.goBack();
  };

  return (
    <PageWrapper>
      <Box className={classes.container}>
        <Box className={classes.titleContainer}>
          <IconButton aria-label="back" onClick={handleBackIconClick}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h2" style={{ margin: "0 auto" }}>
            Create Proposal
          </Typography>
        </Box>
        <ProposedActionItem />
        <ItemContainer label="Gateway URL">
          <TextField
            id="gateway-url"
            InputProps={{ disableUnderline: true }}
            placeholder="Gateway URL"
          />
        </ItemContainer>
        <ItemContainer label="Proposal">
          <TextField id="proposal-title" placeholder="Proposal Title" />
          <TextField
            id="proposal-description"
            multiline
            margin="dense"
            style={{ minHeight: 208 }}
            InputProps={{ disableUnderline: true, style: { minHeight: 208 } }}
            SelectProps={{ style: { minHeight: 208 } }}
            placeholder={`## Summary \n\nInsert your summary here \n\n## Methodology\n\nInsert your methodology here \n\n## Conclusion \n\nInsert your conclusion here \n\n`}
          />
        </ItemContainer>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: 18, height: 54, borderRadius: 20 }}
        >
          Submit
        </Button>
      </Box>
    </PageWrapper>
  );
};

const CreateProposalContainer: React.FC = () => {
  return (
    <CreateProposalProvider>
      <CreateProposal />
    </CreateProposalProvider>
  );
};
export default CreateProposalContainer;
