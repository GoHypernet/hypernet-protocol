import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import { useAlert } from "react-alert";
import { Form, Formik } from "formik";

import {
  GovernanceDialog,
  GovernanceButton,
  GovernanceField,
} from "@web-ui/components";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { EthereumAddress } from "@hypernetlabs/objects";
import { useStyles } from "@web-integration/widgets/DelegateVotesWidget/DelegateVotesWidget.style";

interface IValues {
  accountAddress: EthereumAddress;
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
  const [accountAddress, setAccountAddress] = useState<EthereumAddress>(
    EthereumAddress(""),
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
                      setAccountAddress(EthereumAddress(event.target.value))
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
