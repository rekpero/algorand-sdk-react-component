import * as React from "react";
import AccountDetailComponent from "../stateless/accountdetailcomponent";
import AccountTransactionComponent from "../stateless/accounttransactioncomponent";
import $ from "jquery";
import AlgorandClient from "../../services/algorandsdk";

/**
 * This component will show account details and account transaction list for the address also can change address
 * @props address: string -> account address
 * @props mnemonic: string -> account mnemonic
 * @props accountList: Array -> list of account created
 * @props changeAccount: (account) => void -> send account to be changed
 *
 * @state balance: number -> store balance in account
 * @state transactions: list of transaction -> store the list of transactions
 * @state transactionLoaded: boolean -> true when transaction is loaded
 *
 * @author [Mitrasish Mukherjee](https://github.com/mmitrasish)
 */
class AccountComponent extends React.Component {
  constructor(props) {
    super(props);
    // initial state
    this.state = {
      balance: 0,
      transactions: [],
      transactionLoaded: false
    };
  }

  componentDidMount = async () => {
    // get address from state
    let addr = this.props.address;

    // get account information
    let accountDet = await AlgorandClient.accountInformation(addr);
    // setting balance to state
    this.setState({
      balance: accountDet.amount / 1000000
    });

    // get transaction params
    let params = await AlgorandClient.getTransactionParams();

    //get all transactions for an address for the last 1000 rounds
    let txts = await AlgorandClient.transactionByAddress(
      addr,
      params.lastRound - 1000,
      params.lastRound
    );

    // setting transaction list and transactionLoaded to true
    this.setState({
      transactions: txts.transactions === undefined ? [] : txts.transactions,
      transactionLoaded: true
    });

    // for tooltip
    $('[data-toggle="tooltip"]').tooltip();
  };

  componentDidUpdate() {
    $('[data-toggle="tooltip"]').tooltip();
  }

  /**
   * Change account details and account transaction.
   *
   * @param {{address: string, mnemonic: string}} account
   */
  changeAccount = account => {
    this.props.changeAccount(account);
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
              address={this.props.address}
              mnemonic={this.props.mnemonic}
              accountList={this.props.accountList}
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
