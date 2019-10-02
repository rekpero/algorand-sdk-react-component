import * as React from "react";
import algosdk from "algosdk";
import TransactionRow from "./transactionrow";

const AccountTransactionComponent = props => {
  return (
    <div className="px-4">
      <div className="d-flex justify-content-between">
        <h3 className="text-secondary">Recent Transactions</h3>
        {props.transactionLoaded === false ? (
          <div className="spinner-border text-info" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        ) : null}
      </div>
      <div>
        {props.transactions.length === 0 ? (
          props.transactionLoaded === true ? (
            <span className="text-info">No recent transaction found</span>
          ) : null
        ) : (
          props.transactions.map(txt => (
            <TransactionRow
              transactionId={txt.tx}
              amount={txt.payment.amount}
              addressFrom={txt.from}
              addressTo={txt.payment.to}
              note={
                txt.note !== undefined ? algosdk.decodeObj(txt.note) : "..."
              }
              key={txt.tx}
            />
          ))
        )}
      </div>
    </div>
  );
};
export default AccountTransactionComponent;
