import * as React from "react";
import AccountDetailComponent from "../stateless/accountdetailcomponent";
import AccountTransactionComponent from "../stateless/accounttransactioncomponent";
import $ from "jquery";
import AlgorandClient from "../../services/algorandsdk";

class AccountComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      balance: 0,
      transactions: [],
      transactionLoaded: false
    };
  }

  componentDidMount = async () => {
    let addr = localStorage.getItem("address");

    let accountDet = await AlgorandClient.accountInformation(addr);
    this.setState({
      balance: accountDet.amount / 1000000
    });

    let params = await AlgorandClient.getTransactionParams();

    //get all transactions for an address for the last 1000 rounds
    let txts = await AlgorandClient.transactionByAddress(
      addr,
      params.lastRound - 1000,
      params.lastRound
    );

    this.setState({
      balance: accountDet.amount / 1000000,
      transactions: txts.transactions === undefined ? [] : txts.transactions,
      transactionLoaded: true
    });

    $('[data-toggle="tooltip"]').tooltip();
  };

  componentDidUpdate() {
    $('[data-toggle="tooltip"]').tooltip();
  }

  changeAccount = account => {
    localStorage.setItem("address", account.address);
    localStorage.setItem("mnemonic", account.mnemonic);
    this.setState({
      balance: 0,
      transactions: [],
      transactionLoaded: false
    });
    this.componentDidMount();
  };
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-5 p-3">
            <AccountDetailComponent
              balance={this.state.balance}
              address={localStorage.getItem("address")}
              mnemonic={localStorage.getItem("mnemonic")}
              accountList={localStorage.getItem("accountList")}
              changeAccount={this.changeAccount}
            />
          </div>
          <div className="col-md-7 p-3">
            <AccountTransactionComponent
              transactions={this.state.transactions}
              transactionLoaded={this.state.transactionLoaded}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default AccountComponent;
