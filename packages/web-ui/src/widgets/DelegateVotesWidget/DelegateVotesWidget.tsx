import React, { useEffect, useState } from "react";
import { TextField } from "@material-ui/core";
import { useAlert } from "react-alert";

import { GovernanceDialog, GovernanceButton } from "@web-ui/components";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { EthereumAddress } from "@hypernetlabs/objects";

interface IDelegateVotesWidget {
  onCloseCallback: () => void;
}

const DelegateVotesWidget: React.FC<IDelegateVotesWidget> = ({
  onCloseCallback,
}: IDelegateVotesWidget) => {
  const alert = useAlert();
  const { coreProxy, UIData } = useStoreContext();
  const { setLoading } = useLayoutContext();
  const [accountAddress, setAccountAddress] = useState<EthereumAddress>(
    EthereumAddress(""),
  );

  useEffect(() => {
    const address = EthereumAddress(
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    );
    coreProxy.getEthereumAccounts().map((accounts) => {
      console.log("accounts DelegateVotesWidget: ", accounts);
      setAccountAddress(accounts[0]);
    });
  }, []);

  const delegateVotes = () => {
    setLoading(true);
    coreProxy
      .delegateVote(accountAddress, null)
      .map(() => {
        setLoading(false);
        onCloseCallback();
      })
      .mapErr(handleError);
  };

  const handleError = (err?: Error) => {
    console.log("handleError err: ", err);
    setLoading(false);
    alert.error(err?.message || "Something went wrong!");
  };

  return (
    <GovernanceDialog
      title="Delegate Voting"
      description="It can be a sentence that describes things that can be done when the enter delegate address."
      isOpen={true}
      onClose={onCloseCallback}
      content={
        <>
          <TextField
            label="Delegate Address"
            fullWidth
            variant="outlined"
            value={accountAddress}
            onChange={(event) =>
              setAccountAddress(EthereumAddress(event.target.value))
            }
          />
          <GovernanceButton
            variant="contained"
            color="primary"
            fullWidth
            onClick={delegateVotes}
          >
            Delegate Votes
          </GovernanceButton>
        </>
      }
    />
  );
};

export default DelegateVotesWidget;
