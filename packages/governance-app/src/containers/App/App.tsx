import { LogUtils } from "@hypernetlabs/utils";
import { Box, ThemeProvider } from "@material-ui/core";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";

import { useStyles } from "./App.style";

import Header from "@governance-app/components/Header";
import Router from "@governance-app/containers/Router";
import { useLayoutContext, StoreProvider } from "@governance-app/contexts";
import {
  ConfigProvider,
  GovernanceBlockchainProvider,
} from "@governance-app/implementations/utilities";
import {
  IConfigProvider,
  IGovernanceBlockchainProvider,
} from "@governance-app/interfaces/utilities";
import { lightTheme, darkTheme } from "@governance-app/theme";

const logUtils = new LogUtils();
const configProvider: IConfigProvider = new ConfigProvider(logUtils);
const governanceBlockchainProvider: IGovernanceBlockchainProvider =
  new GovernanceBlockchainProvider(configProvider, logUtils);

const App: React.FC = () => {
  const { theme } = useLayoutContext();
  const classes = useStyles();
  const [appReady, setAppReady] = useState<boolean>(false);

  useEffect(() => {
    governanceBlockchainProvider
      .initialize()
      .map(() => {
        setAppReady(true);
        /*governanceBlockchainProvider.getProvider().map(async (provider) => {
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

            const proposalDescription = "Proposal #1: Give grant to address"; // Human readable description
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
        });*/
      })
      .mapErr((e) => {});
  }, []);

  return (
    <StoreProvider
      configProvider={configProvider}
      governanceBlockchainProvider={governanceBlockchainProvider}
    >
      <ThemeProvider theme={theme ? lightTheme : darkTheme}>
        <Box className={classes.appWrapper}>
          <BrowserRouter>
            <Header />
            {appReady && <Router />}
          </BrowserRouter>
        </Box>
      </ThemeProvider>
    </StoreProvider>
  );
};

export default App;
