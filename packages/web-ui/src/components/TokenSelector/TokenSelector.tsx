import React from "react";

import { ITokenSelectorOption } from "../../interfaces";
import { SelectInput } from "../SelectInput";

interface TokenSelectorProps {
  tokenSelectorOptions: ITokenSelectorOption[];
  selectedPaymentToken?: ITokenSelectorOption;
  setSelectedPaymentToken: (selectedOption?: ITokenSelectorOption) => void;
}

export const TokenSelector: React.FC<TokenSelectorProps> = (
  props: TokenSelectorProps,
) => {
  const {
    tokenSelectorOptions,
    selectedPaymentToken,
    setSelectedPaymentToken,
  } = props;
  console.log("tokenSelectorOptions: ", tokenSelectorOptions);

  const handleChange = (event: any) => {
    const selectedOption = tokenSelectorOptions?.find(
      (option) => option?.address === event.target.value,
    );
    setSelectedPaymentToken(selectedOption);
  };

  return (
    <div>
      <SelectInput
        options={tokenSelectorOptions}
        label="Token Selector:"
        onChange={handleChange}
        optionLabelKey="tokenName"
        optionValueKey="address"
      />
    </div>
  );
};
