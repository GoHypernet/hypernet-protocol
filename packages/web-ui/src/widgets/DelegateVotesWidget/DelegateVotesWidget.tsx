import React, { useEffect, useState } from "react";
import { TextField, Box } from "@material-ui/core";
import { useAlert } from "react-alert";

import { GovernanceDialog, GovernanceButton } from "@web-ui/components";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { EthereumAddress } from "@hypernetlabs/objects";
import { useStyles } from "@web-integration/widgets/DelegateVotesWidget/DelegateVotesWidget.style";

interface IDelegateVotesWidget {
  onCloseCallback: () => void;
}

const DelegateVotesWidget: React.FC<IDelegateVotesWidget> = ({
  onCloseCallback,
}: IDelegateVotesWidget) => {
  const alert = useAlert();
  const classes = useStyles();
  const { coreProxy, UIData } = useStoreContext();
  const { setLoading } = useLayoutContext();
  const [accountAddress, setAccountAddress] = useState<EthereumAddress>(
    EthereumAddress(""),
  );

  useEffect(() => {
    coreProxy.getEthereumAccounts().map((accounts) => {
      setAccountAddress(accounts[0]);
    });
  }, []);

  const delegateVotes = () => {
    setLoading(true);
    coreProxy
      .delegateVote(accountAddress, null)
      .map(() => {
        UIData.onVotesDelegated.next();
        setLoading(false);
        onCloseCallback();
      })
      .mapErr(handleError);
  };

  const handleError = (err?: Error) => {
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
        <Box className={classes.wrapper}>
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
        </Box>
      }
    />
  );
};

export default DelegateVotesWidget;
