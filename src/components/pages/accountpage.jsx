import * as React from "react";
import AccountComponent from "../stateful/accountcomponent";

/**
 * This component contain account component
 *
 * @state address: string -> store account address from the localstorage
 * @state mnemonic: string -> store account mnemonic from the localstorage
 * @state accountList: list of accounts  -> store the list of accounts from the localstorage
 *
 * @author [Mitrasish Mukherjee](https://github.com/mmitrasish)
 */
class AccountPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: localStorage.getItem("address"),
      mnemonic: localStorage.getItem("mnemonic"),
      accountList: localStorage.getItem("accountList")
    };
  }
  changeAccount = account => {
    console.log(account.address);
    localStorage.setItem("address", account.address);
    localStorage.setItem("mnemonic", account.mnemonic);
    this.setState({
      address: localStorage.getItem("address"),
      mnemonic: localStorage.getItem("mnemonic"),
      accountList: localStorage.getItem("accountList")
    });
  };
  render() {
    return (
      <AccountComponent
        address={this.state.address}
        mnemonic={this.state.mnemonic}
        accountList={JSON.parse(this.state.accountList) || []}
        changeAccount={this.changeAccount}
      />
    );
  }
}
export default AccountPage;
