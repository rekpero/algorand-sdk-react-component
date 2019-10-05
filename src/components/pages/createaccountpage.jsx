import * as React from "react";
import algosdk from "algosdk";
import { withRouter, Link } from "react-router-dom";
import CreateAccountButton from "../stateless/createaccountbutton";

/**
 * This component will generate a new account with a click of generate button
 * Also the restore button will redirect you to restore acount page.
 *
 * @author [Mitrasish Mukherjee](https://github.com/mmitrasish)
 */
const CreateAccountPage = ({ history }) => {
  // this will create a new account and push it to localstorage
  let createAccount = keys => {
    // pushing account address and mnemonic to localstorage
    localStorage.setItem("address", keys.addr);
    localStorage.setItem("mnemonic", algosdk.secretKeyToMnemonic(keys.sk));

    // pushing account to localstorage using json stringify
    let accountList = JSON.parse(localStorage.getItem("accountList")) || [];
    accountList.push({
      address: keys.addr,
      mnemonic: algosdk.secretKeyToMnemonic(keys.sk)
    });
    localStorage.setItem("accountList", JSON.stringify(accountList));

    // redirecting to account page
    history.push("/account");
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="col-md-4">
        <div
          style={{ marginTop: "5em", padding: "4em" }}
          className="rounded-lg shadow border bg-light"
        >
          <div className="form-group mb-4">
            <CreateAccountButton createAccount={createAccount} />
          </div>
          <hr />
          <div className="text-center mt-4">
            <span>
              Already have an account?{" "}
              <Link to="/restore" className="btn btn-outline-secondary ml-2">
                Restore Account
              </Link>
            </span>
          </div>
        </div>
        <div className="text-center text-secondary mt-4">
          Powered by Algorand
        </div>
      </div>
    </div>
  );
};
export default withRouter(CreateAccountPage);
