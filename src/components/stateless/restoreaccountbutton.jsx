import * as React from "react";
import algosdk from "algosdk";

/**
 * This component will restore your account given mnemonic from props with a click of restore button.
 * @props mnemonic: string -> get the mnemonic provided to the component
 * @props restoreAccount: (keys) => void -> this will get the account keys as arg from props
 *
 * @author [Mitrasish Mukherjee](https://github.com/mmitrasish)
 */
const RestoreAccountButton = props => {
  // this will create a new account and push it to props createAccount
  let restoreAccount = () => {
    // generating new account
    var keys = algosdk.mnemonicToSecretKey(props.mnemonic);

    // calling the props createAccount
    props.restoreAccount(keys);
  };

  return (
    <button
      type="button"
      className="btn btn-outline-light col-md-12"
      onClick={restoreAccount}
    >
      Restore Account
    </button>
  );
};
export default RestoreAccountButton;
