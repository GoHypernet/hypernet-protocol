import Button from "@material-ui/core/Button";
import React, { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { ethers } from "ethers";

import { useStoreContext } from "@governance-app/contexts/Store";
import { Box } from "@material-ui/core";

const parseAccount = (account: string) => {
  const length = account.length;
  if (length < 10) {
    return "";
  }

  return `${account.substring(0, 6)}...${account.substring(
    length - 4,
    length,
  )}`;
};

const Wallet: React.FC = () => {
  const history = useHistory();
  const [account, setAccount] = useState<string>("");
  const [balance, setBalance] = useState<string>("");

  const { governanceBlockchainProvider } = useStoreContext();

  /*
  useEffect(() => {
    governanceBlockchainProvider.getProvider().map(async (provider) => {
      const accounts = await provider.listAccounts();
      setAccount(accounts[0]);
      console.log("accounts: ", accounts);
    });
  }, []);
  */

  const handleConnectToAWallet = () => {
    governanceBlockchainProvider.initialize().map(() => {
      governanceBlockchainProvider.getProvider().map(async (provider) => {
        const accounts = await provider.listAccounts();
        setAccount(accounts[0]);
        console.log("accounts: ", accounts);

        const hypertokenContract =
          governanceBlockchainProvider.getHypertokenContract();

        const rawBalance = await hypertokenContract.balanceOf(accounts[0]);
        const balance = ethers.utils.formatUnits(rawBalance, 18);
        const symbol = await hypertokenContract.symbol();

        setBalance(`${balance} ${symbol}`);
        console.log("balance", balance);
      });
    });
  };

  const parsedAccount = useMemo(() => parseAccount(account), [account]);

  return (
    <>
      {!account ? (
        <Button
          variant="contained"
          color="primary"
          onClick={handleConnectToAWallet}
        >
          Connect to a wallet
        </Button>
      ) : (
        <Box display="flex">
          <Button
            variant="contained"
            color="secondary"
            style={{
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            }}
          >
            {balance}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            style={{
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            }}
          >
            {parsedAccount}
          </Button>
        </Box>
      )}
    </>
  );
};

export default Wallet;
