import * as React from "react";
import TransactionComponent from "../stateful/transactioncomponent";
import TransactionOfflineComponent from "../stateful/transactionofflinecomponent";

/**
 * This component contain transaction components.
 *
 * @author [Mitrasish Mukherjee](https://github.com/mmitrasish)
 */
const TransactionPage = () => {
  return (
    <div className="container-fluid row">
      <div className="col-md-6 d-flex justify-content-center">
        <div style={{ marginTop: "5em" }} className="col-md-8">
          <TransactionComponent mnemonic={localStorage.getItem("mnemonic")} />
        </div>
      </div>
      <div className="col-md-6 d-flex justify-content-center">
        <div style={{ marginTop: "5em" }} className="col-md-8">
          <TransactionOfflineComponent />
        </div>
      </div>
    </div>
  );
};
export default TransactionPage;
