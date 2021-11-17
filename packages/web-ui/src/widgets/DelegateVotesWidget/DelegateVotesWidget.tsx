import { EthereumAccountAddress } from "@hypernetlabs/objects";
import { Box } from "@material-ui/core";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";

import {
  GovernanceDialog,
  GovernanceButton,
  GovernanceField,
} from "@web-ui/components";
import { useStyles } from "@web-ui/widgets/DelegateVotesWidget/DelegateVotesWidget.style";

interface IValues {
  accountAddress: EthereumAccountAddress;
}
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
  const [accountAddress, setAccountAddress] = useState<EthereumAccountAddress>(
    EthereumAccountAddress(""),
  );

  useEffect(() => {
    coreProxy.getEthereumAccounts().map((accounts) => {
      setAccountAddress(accounts[0]);
    });
  }, []);

  const handleFormSubmit = (values: IValues) => {
    setLoading(true);
    coreProxy
      .delegateVote(values.accountAddress, null)
      .map(() => {
        UIData.onVotesDelegated.next();
        setLoading(false);
        onCloseCallback();
      })
      .mapErr(handleError);
  };

  const handleError = (err) => {
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
          <Formik
            enableReinitialize
            initialValues={
              {
                accountAddress: accountAddress,
              } as IValues
            }
            onSubmit={handleFormSubmit}
          >
            {({ handleSubmit, values }) => {
              return (
                <Form onSubmit={handleSubmit}>
                  <GovernanceField
                    name="accountAddress"
                    label="Delegate Address"
                    fullWidth
                    variant="outlined"
                    onChange={(event) =>
                      setAccountAddress(
                        EthereumAccountAddress(event.target.value),
                      )
                    }
                  />
                  <GovernanceButton
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit}
                    disabled={!values.accountAddress}
                  >
                    Delegate Votes
                  </GovernanceButton>
                </Form>
              );
            }}
          </Formik>
        </Box>
      }
    />
  );
};

export default DelegateVotesWidget;
