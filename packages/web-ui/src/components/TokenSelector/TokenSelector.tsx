import React from "react";
import { ITokenSelectorOption } from "../../interfaces";

interface TokenSelectorProps {
  tokenSelectorOptions: ITokenSelectorOption[];
  selectedPaymentToken: ITokenSelectorOption;
  setSelectedPaymentToken: (selectedOption?: ITokenSelectorOption) => void;
}

const TokenSelector: React.FC<TokenSelectorProps> = (props: TokenSelectorProps) => {
  const { tokenSelectorOptions, selectedPaymentToken, setSelectedPaymentToken } = props;
  console.log("tokenSelectorOptions: ", tokenSelectorOptions);

  const handleChange = (event: any) => {
    const selectedOption = tokenSelectorOptions?.find((option) => option?.address === event.target.value);
    setSelectedPaymentToken(selectedOption);
  };

  return (
    <div>
      <label>
        Token Selector: -{selectedPaymentToken?.address} -
        <select value={selectedPaymentToken?.address} onChange={handleChange}>
          <option value="">Choose...</option>
          {tokenSelectorOptions?.map((option) => (
            <option value={option?.address}>{option?.tokenName}</option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default TokenSelector;
