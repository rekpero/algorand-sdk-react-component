import * as React from "react";
import algosdk from "algosdk";
import { withRouter, Link } from "react-router-dom";

const CreateAccountComponent = ({ history }) => {
  let generateAccount = async () => {
    let keys = algosdk.generateAccount();

    localStorage.setItem("address", keys.addr);
    localStorage.setItem("mnemonic", algosdk.secretKeyToMnemonic(keys.sk));

    let accountList = JSON.parse(localStorage.getItem("accountList")) || [];
    accountList.push({
      address: keys.addr,
      mnemonic: algosdk.secretKeyToMnemonic(keys.sk)
    });
    localStorage.setItem("accountList", JSON.stringify(accountList));

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
            <button
              type="button"
              className="btn btn-outline-primary col-md-12"
              onClick={generateAccount}
            >
              Generate Account
            </button>
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
      </div>
    </div>
  );
};
export default withRouter(CreateAccountComponent);
