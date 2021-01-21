import * as React from "react";

interface TransactionListProps {
  transactionDataList?: any[];
}

const TransactionList: React.FC<TransactionListProps> = (props: TransactionListProps) => {
  const { transactionDataList } = props;
  console.log("transactionDataList: ", transactionDataList);

  return (
    <h2>
      TransactionList from web ui package loaded with data from HypernetWebIntegration
      <br />
      {transactionDataList?.length &&
        transactionDataList.map((trs) => (
          <>
            <h3>id: {trs.id}</h3>
            <h3>amount: {trs.amount}</h3>
          </>
        ))}
    </h2>
  );
};

export default TransactionList;
