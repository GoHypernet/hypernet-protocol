import { EthereumAccountAddress } from "@hypernetlabs/objects";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { IProposalCreateWidgetParams } from "@web-ui/interfaces";
import { Form, Formik, FormikHelpers } from "formik";
import React, { useEffect, useState, useMemo } from "react";
import * as Yup from "yup";

import {
  GovernanceButton,
  GovernanceDialogSelectLargeField,
  GovernanceLargeField,
  GovernanceWidgetHeader,
} from "@web-ui/components";

enum ERegistryAction {
  ADD_REGISTRY = 0,
}

interface IValues {
  action: ERegistryAction;
  name: string;
  symbol: string;
  enumerable: boolean;
  owner: EthereumAccountAddress;
}

const CreateProposalWidget: React.FC<IProposalCreateWidgetParams> = ({
  onProposalListNavigate,
}: IProposalCreateWidgetParams) => {
  const { coreProxy } = useStoreContext();
  const { setLoading, handleCoreError } = useLayoutContext();
  const [accountAddress, setAccountAddress] = useState<EthereumAccountAddress>(
    EthereumAccountAddress(""),
  );
  const [proposalThreshold, setProposalThreshold] = useState<number>();
  const [votingPower, setVotingPower] = useState<number>();

  useEffect(() => {
    coreProxy
      .getProposalThreshold()
      .map((_proposalThreshold) => {
        setProposalThreshold(_proposalThreshold);
      })
      .mapErr(handleCoreError);

    coreProxy
      .getEthereumAccounts()
      .map((accounts) => {
        setAccountAddress(accounts[0]);

        coreProxy
          .getVotingPower(accounts[0])
          .map((power) => {
            setVotingPower(power);
          })
          .mapErr(handleCoreError);
      })
      .mapErr(handleCoreError);
  }, []);

  const handleCreatePrposalFormSubmit = async (
    values: IValues,
    formikHelpers: FormikHelpers<IValues>,
  ) => {
    setLoading(true);
    coreProxy
      .createProposal(
        values.name,
        values.symbol,
        EthereumAccountAddress(values.owner),
        values.enumerable,
      )
      .map((proposal) => {
        setLoading(false);
        onProposalListNavigate && onProposalListNavigate();
      })
      .mapErr(handleCoreError);
  };

  const exceedsThreshold: boolean = useMemo(() => {
    return !votingPower || !proposalThreshold
      ? false
      : votingPower >= proposalThreshold;
  }, [proposalThreshold, votingPower]);

  return (
    <>
      <GovernanceWidgetHeader
        label="Create Proposal"
        navigationLink={{
          label: "Proposal list",
          onClick: () => {
            onProposalListNavigate && onProposalListNavigate();
          },
        }}
      />
      <Formik
        initialValues={{
          action: ERegistryAction.ADD_REGISTRY,
          name: "",
          symbol: "",
          enumerable: true,
          owner: accountAddress,
        }}
        enableReinitialize={true}
        onSubmit={handleCreatePrposalFormSubmit}
        validationSchema={Yup.object().shape({
          action: Yup.number().required("Required"),
        })}
      >
        {({ handleSubmit, isSubmitting, values }) => (
          <Form onSubmit={handleSubmit} id="CreateProposalForm">
            <GovernanceDialogSelectLargeField
              name="action"
              title="Proposed Action"
              type="select"
              placeholder={"select action"}
              required={true}
              options={[
                {
                  primaryText: "Add Registry",
                  secondaryText: undefined,
                  action: null,
                  value: ERegistryAction.ADD_REGISTRY,
                },
              ]}
            />
            {values.action == ERegistryAction.ADD_REGISTRY && (
              <>
                <GovernanceDialogSelectLargeField
                  name="enumerable"
                  title="Enumerable Tokens"
                  type="select"
                  placeholder={"select action"}
                  required={true}
                  options={[
                    {
                      primaryText: "Enabled",
                      secondaryText: undefined,
                      action: null,
                      value: true,
                    },
                    {
                      primaryText: "Disabled",
                      secondaryText: undefined,
                      action: null,
                      value: false,
                    },
                  ]}
                />
                <GovernanceLargeField
                  title="Name"
                  name="name"
                  type="input"
                  placeholder="Type a Name"
                  required={values.action == ERegistryAction.ADD_REGISTRY}
                />

                <GovernanceLargeField
                  title="Symbol"
                  name="symbol"
                  type="input"
                  placeholder="Type a Symbol"
                  required={values.action == ERegistryAction.ADD_REGISTRY}
                />
                <GovernanceLargeField
                  title="Owner"
                  name="owner"
                  type="input"
                  placeholder="Type an Owner"
                  required={values.action == ERegistryAction.ADD_REGISTRY}
                />
              </>
            )}

            <GovernanceButton
              variant="contained"
              size="medium"
              form="CreateProposalForm"
              type="submit"
              fullWidth
              color="primary"
              disabled={!exceedsThreshold}
              onClick={() => {}}
            >
              {exceedsThreshold
                ? "Submit"
                : `You must have ${proposalThreshold} votes to submit a proposal`}
            </GovernanceButton>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default CreateProposalWidget;
