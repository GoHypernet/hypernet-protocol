import { SelectInput, TextareaInput, Button } from "@hypernetlabs/web-ui";
import React, { useContext, useState } from "react";

import { LayoutContext, StoreContext } from "@web-integration/contexts";

const PrivateKeysFlow: React.FC = () => {
  const { proxy } = useContext(StoreContext);
  const { closeModal } = useContext(LayoutContext);
  const [inputValue, setInputValue] = useState<string>("");
  const [privateKeyType, setPrivateKeyType] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = () => {
    const privateKey = privateKeyType === "privateKey" ? inputValue : null;
    const mnemonic = privateKeyType === "mnemonic" ? inputValue : null;
    proxy.providePrivateCredentials(privateKey, mnemonic).match(
      () => {
        closeModal();
      },
      (err) => {
        setErrorMessage(err.message || "Err while providePrivateCredentials.");
      },
    );
  };

  const privateKeyTypes = [
    { value: "privateKey", label: "Private Key" },
    { value: "mnemonic", label: "Mnemonic" },
  ];

  return (
    <div>
      <SelectInput
        options={privateKeyTypes}
        optionValueKey="value"
        optionLabelKey="label"
        label="Select your key type:"
        onChange={(event) => setPrivateKeyType(event.target.value)}
      />
      <br />
      <TextareaInput
        label="Amount"
        value={inputValue}
        onChange={(value) => setInputValue(value)}
      />
      <br />
      <br />
      <Button onClick={handleSubmit} label="Provide your Key" />
      {errorMessage && (
        <>
          <br />
          <div>{errorMessage}</div>
        </>
      )}
    </div>
  );
};

export default PrivateKeysFlow;
