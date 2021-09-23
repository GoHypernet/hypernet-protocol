import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";

import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { EthereumAddress, EVoteSupport } from "@hypernetlabs/objects";
import {
  GovernanceButton,
  GovernanceDialogSelectField,
  GovernanceLargeField,
  GovernanceWidgetHeader,
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
  owner: EthereumAddress;
}

const CreateProposalWidget: React.FC<IProposalCreateWidgetParams> = ({
  onProposalListNavigate,
}: IProposalCreateWidgetParams) => {
  const alert = useAlert();
  const { coreProxy, UIData } = useStoreContext();
  const { setLoading } = useLayoutContext();
  const [accountAddress, setAccountAddress] = useState<EthereumAddress>(
    EthereumAddress(""),
  );

  useEffect(() => {
    coreProxy.getEthereumAccounts().map((accounts) => {
      console.log("accounts CreateProposalWidget: ", accounts);
      setAccountAddress(accounts[0]);
    });

    coreProxy
      .getRegistries(10)
      .map((registriesLabels) => {
        console.log("registriesLabels: ", registriesLabels);
      })
      .mapErr(handleError);
  }, []);

  const handleError = (err?: Error) => {
    console.log("handleError err: ", err);
    setLoading(false);
    alert.error(err?.message || "Something went wrong!");
  };

  const handleCreatePrposalFormSubmit = async (
    values: IValues,
    formikHelpers: FormikHelpers<IValues>,
  ) => {
    console.log("handleCreatePrposalFormSubmit values", values);
    setLoading(true);
    if (values.action == ERegistryAction.ADD_REGISTRY) {
      coreProxy
        .createProposal(
          values.name,
          values.symbol,
          EthereumAddress(values.owner),
        )
        .map((proposal) => {
          console.log("created proposal FE: ", proposal);
          setLoading(false);
          onProposalListNavigate && onProposalListNavigate();
        })
        .mapErr(handleError);
    } else {
      console.log("not implemented yet");
      coreProxy
        .proposeRegistryEntry(
          "Gateways",
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
          console.log("created gateway FE: ", proposal);
          setLoading(false);
          onProposalListNavigate && onProposalListNavigate();
        })
        .mapErr(handleError);
    }
  };

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
            <GovernanceDialogSelectField
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
                {
                  primaryText: "Add Gateway",
                  secondaryText: undefined,
                  action: null,
                  value: ERegistryAction.ADD_GATEWAY,
                },
              ]}
            />
            {values.action == ERegistryAction.ADD_REGISTRY && (
              <>
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
              onClick={() => {}}
            >
              Submit
            </GovernanceButton>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default CreateProposalWidget;
