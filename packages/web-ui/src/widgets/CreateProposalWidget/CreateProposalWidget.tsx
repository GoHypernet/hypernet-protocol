import React, { useEffect, useState, useMemo } from "react";
import { useAlert } from "react-alert";
import { Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";

import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { EthereumAddress, Registry } from "@hypernetlabs/objects";
import {
  GovernanceButton,
  GovernanceDialogSelectLargeField,
  GovernanceLargeField,
  GovernanceWidgetHeader,
  IGovernanceDialogSelectLargeFieldOption,
} from "@web-integration/components";
import { IProposalCreateWidgetParams } from "@web-ui/interfaces";

enum ERegistryAction {
  ADD_REGISTRY = 0,
  ADD_GATEWAY = 1,
}

interface IValues {
  action: ERegistryAction;
  name: string;
  symbol: string;
  gatewayUrl: string;
  gatewayName: string;
  gatewayLogoUrl: string;
  gatewayAddress: string;
  gatewaySignature: string;
  enumerable: boolean;
  owner: EthereumAddress;
}

const gatewaysRegistryName = "Gateways";

const CreateProposalWidget: React.FC<IProposalCreateWidgetParams> = ({
  onProposalListNavigate,
}: IProposalCreateWidgetParams) => {
  const alert = useAlert();
  const { coreProxy, UIData } = useStoreContext();
  const { setLoading } = useLayoutContext();
  const [accountAddress, setAccountAddress] = useState<EthereumAddress>(
    EthereumAddress(""),
  );
  const [proposalThreshold, setProposalThreshold] = useState<number>();
  const [votingPower, setVotingPower] = useState<number>();
  const [gatewayRegistry, setGatewayRegistry] = useState<Registry>();

  useEffect(() => {
    coreProxy
      .getProposalThreshold()
      .map((_proposalThreshold) => {
        setProposalThreshold(_proposalThreshold);
      })
      .mapErr(handleError);

    coreProxy
      .getRegistryByName([gatewaysRegistryName])
      .map((registryMap) => {
        setGatewayRegistry(registryMap.get(gatewaysRegistryName));
      })
      .mapErr(handleError);

    coreProxy
      .getEthereumAccounts()
      .map((accounts) => {
        setAccountAddress(accounts[0]);

        coreProxy
          .getVotingPower(accounts[0])
          .map((power) => {
            setVotingPower(power);
          })
          .mapErr(handleError);
      })
      .mapErr(handleError);
  }, []);

  const handleError = (err?: Error) => {
    setLoading(false);
    alert.error(err?.message || "Something went wrong!");
  };

  const handleCreatePrposalFormSubmit = async (
    values: IValues,
    formikHelpers: FormikHelpers<IValues>,
  ) => {
    setLoading(true);
    if (values.action == ERegistryAction.ADD_REGISTRY) {
      coreProxy
        .createProposal(
          values.name,
          values.symbol,
          EthereumAddress(values.owner),
          values.enumerable,
        )
        .map((proposal) => {
          setLoading(false);
          onProposalListNavigate && onProposalListNavigate();
        })
        .mapErr(handleError);
    } else {
      coreProxy
        .proposeRegistryEntry(
          gatewaysRegistryName,
          values.gatewayUrl,
          JSON.stringify({
            gatewayName: values.gatewayName,
            gatewayLogoUrl: values.gatewayLogoUrl,
            gatewayAddress: values.gatewayAddress,
            gatewaySignature: values.gatewaySignature,
          }),
          EthereumAddress(values.owner),
        )
        .map((proposal) => {
          setLoading(false);
          onProposalListNavigate && onProposalListNavigate();
        })
        .mapErr(handleError);
    }
  };

  const isAccountGatewayRegistrarAddress = useMemo(() => {
    return gatewayRegistry?.registrarAddresses.includes(accountAddress);
  }, [gatewayRegistry, accountAddress]);

  const actionList: IGovernanceDialogSelectLargeFieldOption[] = useMemo(() => {
    const actions = [
      {
        primaryText: "Add Registry",
        secondaryText: undefined,
        action: null,
        value: ERegistryAction.ADD_REGISTRY,
      },
    ];
    if (isAccountGatewayRegistrarAddress) {
      actions.push({
        primaryText: "Add Gateway",
        secondaryText: undefined,
        action: null,
        value: ERegistryAction.ADD_GATEWAY,
      });
    }
    return actions;
  }, [gatewayRegistry]);

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
          gatewayUrl: "",
          gatewayAddress: "",
          gatewaySignature: "",
          gatewayName: "",
          gatewayLogoUrl: "",
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
              options={actionList}
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

            {values.action == ERegistryAction.ADD_GATEWAY && (
              <>
                <GovernanceLargeField
                  title="Gateway URL"
                  name="gatewayUrl"
                  type="input"
                  placeholder="Type a Gateway URL"
                  required={values.action == ERegistryAction.ADD_GATEWAY}
                />
                <GovernanceLargeField
                  title="Address"
                  name="gatewayAddress"
                  type="input"
                  placeholder="Type gateway address"
                  required={false}
                />
                <GovernanceLargeField
                  title="Signature"
                  name="gatewaySignature"
                  type="input"
                  placeholder="Type gateway Signature"
                  required={false}
                />
                <GovernanceLargeField
                  title="Name"
                  name="gatewayName"
                  type="input"
                  placeholder="Type gateway Name"
                  required={false}
                />
                <GovernanceLargeField
                  title="Logo URL"
                  name="gatewayLogoUrl"
                  type="input"
                  placeholder="Type gateway logo URL"
                  required={false}
                />
              </>
            )}
            <GovernanceButton
              variant="contained"
              size="large"
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
