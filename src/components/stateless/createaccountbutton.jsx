import * as React from "react";
import algosdk from "algosdk";

/**
 * This component will generate a new account with a click of generate button.
 * @props createAccount: (keys) => void -> this will get the account keys as arg from props
 *
 * @author [Mitrasish Mukherjee](https://github.com/mmitrasish)
 */
const CreateAccountButton = props => {
  // this will create a new account and push it to props createAccount
  let generateAccount = () => {
    // generating new account
    let keys = algosdk.generateAccount();

    // calling the props createAccount
    props.createAccount(keys);
  };

  return (
    <button
      type="button"
      className="btn btn-outline-primary col-md-12"
      onClick={generateAccount}
    >
      Generate Account
    </button>
  );
};
export default CreateAccountButton;
