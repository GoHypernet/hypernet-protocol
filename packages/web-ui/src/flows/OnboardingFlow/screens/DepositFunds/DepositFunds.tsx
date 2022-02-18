import React, { useEffect } from "react";

import FundWidget from "@web-ui/widgets/FundWidget/FundWidget";
import { useLayoutContext } from "@web-ui/contexts";

interface IDepositFundsProps {
  excludeCardWrapper: boolean;
}

const DepositFunds: React.FC<IDepositFundsProps> = (
  props: IDepositFundsProps,
) => {
  const { excludeCardWrapper } = props;

  const { setModalHeader } = useLayoutContext();

  useEffect(() => {
    setModalHeader("Deposit Funds");

    return () => {
      setModalHeader("");
    };
  }, []);

  return (
    <FundWidget
      selectType="dropdown"
      excludeCardWrapper={excludeCardWrapper}
      noHeader
    />
  );
};

export default DepositFunds;
