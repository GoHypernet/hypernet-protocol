import React, {
  CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useHistory } from "react-router-dom";
import PageWrapper from "@governance-app/components/PageWrapper";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import ProposalActionSelector from "./ProposalActionSelector/ProposalActionSelector";

import {
  CreateProposalProvider,
  useCreateProposalContext,
} from "./CreateProposal.context";
import { useStoreContext } from "@governance-app/contexts/Store";
import { useStyles } from "./CreateProposal.style";
import { ethers, BigNumber } from "ethers";

const ProposalField = (props: {
  children: React.ReactNode;
  label: string;
  style?: CSSProperties;
}) => {
  const { children, label, style } = props;
  const classes = useStyles();

  return (
    <Card
      className={classes.proposalFieldContainer}
      style={{ borderRadius: 20, padding: 20, marginTop: 12, ...style }}
      elevation={0}
    >
      <Typography className={classes.proposalFieldLabel}>{label}</Typography>
      {children}
    </Card>
  );
};

const ProposedActionItem = () => {
  const { toggleProposalActionSelector, selectedProposalAction } =
    useCreateProposalContext();

  const handleProposedActionClick = () => {
    toggleProposalActionSelector();
  };
  return (
    <ProposalField label="Proposed Action">
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
    </ProposalField>
  );
};

const SubmitButton = (props: {
  isReady: boolean;
  exceedsThreshold: boolean;
  threshold?: BigNumber;
  onSubmit: () => void;
}) => {
  const { isReady, exceedsThreshold, onSubmit, threshold } = props;
  const classes = useStyles();

  const formattedThreshold = threshold
    ? ethers.utils.formatUnits(threshold, 18)
    : "";

  console.log(props);
  if (!isReady) {
    return (
      <Button
        className={classes.submitButton}
        variant="contained"
        color="primary"
        fullWidth
        disabled
      >
        <CircularProgress />
      </Button>
    );
  }
  return exceedsThreshold ? (
    <Button
      className={classes.submitButton}
      variant="contained"
      color="primary"
      onClick={onSubmit}
      fullWidth
    >
      Submit
    </Button>
  ) : (
    <Button
      className={classes.submitButton}
      variant="contained"
      color="secondary"
      disabled
      fullWidth
    >
      You must have {formattedThreshold} tokens to submit a proposal
    </Button>
  );
};

const CreateProposal: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const { governanceBlockchainProvider, balance } = useStoreContext();
  const [threshold, setThreshold] = useState<BigNumber>();

  const titleRef = useRef<any>();
  const descriptionRef = useRef<any>();

  const handleBackIconClick = () => {
    history.goBack();
  };

  useEffect(() => {
    governanceBlockchainProvider.initialize().map(async () => {
      const governorContract =
        governanceBlockchainProvider.getHypernetGovernorContract();

      const threshold: BigNumber = await governorContract.proposalThreshold();

      setThreshold(threshold);
    });
  }, []);

  const isReady = useMemo(() => {
    return !!balance && !!threshold;
  }, [balance, threshold]);

  const exceedsThreshold = useMemo(() => {
    if (!balance || !threshold) {
      return false;
    }

    return balance >= threshold;
  }, [balance, threshold]);

  const onSubmit = () => {
    governanceBlockchainProvider
      .initialize()
      .map(() => {
        governanceBlockchainProvider.getProvider().map(async (provider) => {
          const accounts = await provider.listAccounts();
          console.log("accounts: ", accounts);

          governanceBlockchainProvider.getSigner().map(async (signer) => {
            const hypernetGovernorContract =
              governanceBlockchainProvider.getHypernetGovernorContract();

            const hypertokenContract =
              governanceBlockchainProvider.getHypertokenContract();

            // needed only for voting
            // const txvotes = await hypertokenContract.delegate(accounts[0]);
            // console.log("txvotes: ", txvotes);
            // const txvotes_receipt = await txvotes.wait();
            // console.log("txvotes_receipt: ", txvotes_receipt);

            const proposalDescription = `${titleRef?.current?.value}\n${descriptionRef?.current?.value}`;

            const descriptionHash = ethers.utils.id(proposalDescription); // Hash description to help compute the proposal ID
            const transferCalldata =
              hypertokenContract.interface.encodeFunctionData("transfer", [
                await signer.getAddress(),
                7,
              ]); // encode the function to be called

            const proposalID = await hypernetGovernorContract.hashProposal(
              [hypertokenContract.address],
              [0],
              [transferCalldata],
              descriptionHash,
            ); // pre-compute the proposal ID for easy lookup later
            console.log("proposalID", proposalID);

            // propose a vote
            const tx = await hypernetGovernorContract[
              "propose(address[],uint256[],bytes[],string)"
            ](
              [hypertokenContract.address],
              [0],
              [transferCalldata],
              proposalDescription,
            );
            console.log("tx", tx);
            const tx_reciept = await tx.wait();
            console.log("tx_reciept: ", tx_reciept);
          });
        });
      })
      .mapErr((e) => {});
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
        <ProposalField label="Gateway URL">
          <TextField
            id="gateway-url"
            InputProps={{ disableUnderline: true }}
            placeholder="Gateway URL"
          />
        </ProposalField>
        <ProposalField label="Proposal" style={{ minHeight: 300 }}>
          <TextField
            id="proposal-title"
            placeholder="Proposal Title"
            inputRef={titleRef}
          />
          <TextField
            id="proposal-description"
            multiline
            className={classes.proposalDescription}
            margin="dense"
            // style={{ minHeight: 208, }}
            rows={5}
            InputProps={{ disableUnderline: true, style: { minHeight: 208 } }}
            SelectProps={{ style: { minHeight: 208 } }}
            placeholder={`## Summary \n\nInsert your summary here \n\n## Methodology\n\nInsert your methodology here \n\n## Conclusion \n\nInsert your conclusion here \n\n`}
            inputRef={descriptionRef}
          />
        </ProposalField>
        <SubmitButton
          isReady={isReady}
          exceedsThreshold={exceedsThreshold}
          threshold={threshold}
          onSubmit={onSubmit}
        />
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
