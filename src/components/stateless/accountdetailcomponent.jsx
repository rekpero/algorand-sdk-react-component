import * as React from "react";
import algosicon from "../../assets/images/algorandicon.webp";
import copy from "clipboard-copy";
import { Route } from "react-router-dom";

/**
 * This component will show account details and account transaction list for the address also can change address
 * @props balace: number -> account balance
 * @props address: string -> account address
 * @props mnemonic: string -> account mnemonic
 * @props accountList: Array -> list of account created
 * @props changeAccount: (account) => void -> send account to be changed
 *
 * @author [Mitrasish Mukherjee](https://github.com/mmitrasish)
 */
const AccountDetailComponent = props => {
  // Download mnemonic file
  let downloadMnemonicFile = () => {
    const element = document.createElement("a");
    const file = new Blob([props.mnemonic], {
      type: "text/plain"
    });
    element.href = URL.createObjectURL(file);
    element.download = "mnemonic.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  // copy to clipboard
  let copyToClipboard = () => {
    copy(props.address);
  };

  return (
    <div className="rounded-lg shadow border bg-light text-center p-4">
      <div className="d-flex justify-content-between align-items-center">
        <div></div>
        <div>
          <h4>Account</h4>
          <span
            className="badge badge-secondary"
            data-toggle="tooltip"
            data-placement="bottom"
            data-html="true"
            title={
              "<div>Copy to clipboard</div><div>" + props.address + "</div>"
            }
            onClick={copyToClipboard}
          >
            {props.address.substr(0, 10)}...
            {props.address.substr(-4, 4)}
          </span>
        </div>
        <div>
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenu2"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          ></button>
          <div
            className="dropdown-menu dropdown-menu-right"
            aria-labelledby="dropdownMenu2"
          >
            <span className="dropdown-item disabled">My Accounts</span>
            <div className="dropdown-divider"></div>
            {props.accountList.map((account, index) => (
              <button
                className="dropdown-item"
                type="button"
                key={account.address}
                onClick={e => {
                  props.changeAccount(account);
                }}
              >
                <div className="font-weight-bold">Account {index + 1}</div>
                <span className="badge badge-secondary">
                  {account.address.substr(0, 5)}...
                  {account.address.substr(-4, 4)}
                </span>
              </button>
            ))}

            <div className="dropdown-divider"></div>
            <Route
              render={({ history }) => (
                <button
                  className="dropdown-item"
                  type="button"
                  onClick={() => {
                    history.push("/create");
                  }}
                >
                  Create Account
                </button>
              )}
            />
            <Route
              render={({ history }) => (
                <button
                  className="dropdown-item"
                  type="button"
                  onClick={() => {
                    history.push("/restore");
                  }}
                >
                  Restore Account
                </button>
              )}
            />
          </div>
        </div>
      </div>
      <hr />
      <div className="mt-5">
        <img
          src={algosicon}
          alt="algos icon"
          className="rounded-circle img-fluid border"
          style={{ height: 80, width: 80 }}
        />
        <h2 className="mt-4">{props.balance} ALGOS</h2>
      </div>
      <div className="mt-5 text-left px-3">
        <div className="d-flex justify-content-between">
          <h4>Mnemonic</h4>
          <div>
            <a
              className="badge badge-primary text-white p-2"
              style={{ fontSize: 16 }}
              onClick={downloadMnemonicFile}
            >
              save
            </a>
          </div>
        </div>
        <div className="mt-2">
          {props.mnemonic.split(" ").map(term => (
            <span className="badge badge-info m-1" key={term}>
              {term.trim()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountDetailComponent;
