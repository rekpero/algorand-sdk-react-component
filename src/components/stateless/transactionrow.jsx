import * as React from "react";
import algosicon from "../../assets/images/algorandicon.webp";

/**
 * This component will show account transaction list for the address
 * @props transactionId: string -> transaction id
 * @props amount: number -> amount sent (in Algos)
 * @props addressFrom: string -> address from where the pay is sent
 * @props addressTo: string -> address to where the pay is sent
 * @props note: string -> note added with the pay
 *
 *
 * @author [Mitrasish Mukherjee](https://github.com/mmitrasish)
 */
const TransactionRow = props => {
  return (
    <div>
      <div className="rounded-lg border bg-light px-4 py-3 row d-flex align-items-center my-2">
        <div className="col-md-2 text-center p-2">
          <img
            src={algosicon}
            alt="algos icon"
            className="rounded-circle img-fluid border"
            style={{ height: 60, width: 60 }}
          />
        </div>
        <div className="col-md-10">
          <div className="row">
            <div className="col-md-8">
              <h5>
                {props.transactionId.substr(0, 10)}
                ...
                {props.transactionId.substr(-5, 5)}
              </h5>
            </div>
            <div className="col-md-4 text-right">
              <h5
                className={
                  props.addressFrom === localStorage.getItem("address")
                    ? "text-danger"
                    : "text-success"
                }
              >
                {props.addressFrom === localStorage.getItem("address")
                  ? -props.amount / 1000000
                  : props.amount / 1000000}{" "}
                ALGOS
              </h5>
            </div>
          </div>
          <div className="row text-secondary">
            <div className="col-md-6">
              <span className="font-weight-bold">from: </span>
              <span className="badge badge-secondary">
                {props.addressFrom.substr(0, 5)}
                ...
                {props.addressFrom.substr(-4, 4)}
              </span>
            </div>
            <div className="col-md-6">
              <span className="font-weight-bold">to: </span>
              <span className="badge badge-secondary">
                {props.addressTo.substr(0, 5)}
                ...
                {props.addressTo.substr(-4, 4)}
              </span>
            </div>
          </div>
          <div className="row text-info">
            <div className="col-md-12">
              <span className="font-weight-bold">note: </span>
              <span>{props.note}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TransactionRow;
