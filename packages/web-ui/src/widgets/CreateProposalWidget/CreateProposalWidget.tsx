import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";

import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { EthereumAddress } from "@hypernetlabs/objects";
import {
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
    if (values.action === ERegistryAction.ADD_REGISTRY) {
      coreProxy
        .createProposal(
          values.name,
          values.symbol,
          EthereumAddress(values.owner),
        )
        .map((proposal) => {
          console.log("created proposal FE: ", proposal);
          setLoading(false);
        })
        .mapErr(handleError);
    } else {
      console.log("not implemented yet");
    }
  };

  return (
    <Formik
      initialValues={{
        action: ERegistryAction.ADD_REGISTRY,
        name: "",
        symbol: "",
        owner: accountAddress,
      }}
      enableReinitialize={true}
      onSubmit={handleCreatePrposalFormSubmit}
      validationSchema={Yup.object().shape({
        action: Yup.number().required("Required"),
        name: Yup.string().required("Required"),
        symbol: Yup.string().required("Required"),
        owner: Yup.string().required("Required"),
      })}
    >
      <GovernanceWidgetHeader
        label="Create Proposal"
        navigationLink={{
          label: "Proposal list",
          onClick: () => {
            onProposalListNavigate && onProposalListNavigate();
          },
        }}
      />
      {({ handleSubmit, isSubmitting }) => (
        <Form onSubmit={handleSubmit} id="ProductCreateUpdateForm">
          <GovernanceLargeField
            name="action"
            title="Proposed Action"
            type="select"
            placeholder={"select action"}
            required={true}
            options={[
              { label: "Add registry", value: ERegistryAction.ADD_REGISTRY },
              { label: "Add Gateway", value: ERegistryAction.ADD_GATEWAY },
            ]}
          />
          <GovernanceLargeField
            title="Name"
            name="name"
            type="input"
            placeholder="Type a Name"
            required={true}
          />
          <GovernanceLargeField
            title="Symbol"
            name="symbol"
            type="input"
            placeholder="Type a Symbol"
            required={true}
          />
          <GovernanceLargeField
            title="Owner"
            name="owner"
            type="input"
            placeholder="Type an Owner"
            required={true}
          />
        </Form>
      )}
    </Formik>
  );
};

export default CreateProposalWidget;
