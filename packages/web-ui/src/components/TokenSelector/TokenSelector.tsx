import { ITokenSelectorOption } from "@web-ui/interfaces";
import React from "react";

import { SelectInput } from "@web-ui/components";

interface TokenSelectorProps {
  tokenSelectorOptions: ITokenSelectorOption[];
  selectedPaymentToken?: ITokenSelectorOption;
  setSelectedPaymentToken: (selectedOption?: ITokenSelectorOption) => void;
  label?: string;
}

export const TokenSelector: React.FC<TokenSelectorProps> = (
  props: TokenSelectorProps,
) => {
  const {
    tokenSelectorOptions,
    selectedPaymentToken,
    setSelectedPaymentToken,
    label = "Token Selector:",
  } = props;

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
        label={label}
        value={selectedPaymentToken?.address}
        onChange={handleChange}
        optionLabelKey="tokenName"
        optionValueKey="address"
      />
    </div>
  );
};
