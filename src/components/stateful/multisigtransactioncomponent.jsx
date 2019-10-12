import * as React from "react";
import algosdk from "algosdk";
import $ from "jquery";
import AlgorandClient from "../../services/algorandsdk";
import copy from "clipboard-copy";
import SuggestedFeeComponent from "./suggestedfeecomponent";

/**
 * This component is used to send online multisig transaction.
 * You have to first generate some accounts which can is taken from users, the number of account to generate and the threshold and all other field similar to transaction component
 *
 * @state addressTo: {value: string, isValid: boolean, message: string} -> store address to send payment
 * @state amount: number -> store the amount to send
 * @state note: string -> store the note
 * @state numberOfAccount: number -> store the number of account to be created
 * @state accountList: list of account -> store the list of account created
 * @state threshold: number -> store the threshold
 * @state txnId: string -> store transaction id after the transaction is complete
 * @state errorMessage: string -> store error message if there is any error during transaction
 * @state accountCreated: boolean -> true when account is created
 *
 * @author [Mitrasish Mukherjee](https://github.com/mmitrasish)
 */
export default class MultisigTransactionComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addressTo: {
        value: "",
        isValid: true,
        message: "Please choose an address."
      },
      amount: "",
      note: "",
      numOfAddress: 1,
      accountList: [],
      mparams: {},
      multsigaddr: "",
      threshold: 1,
      txnId: "",
      errorMessage: "",
      accountCreated: false
    };
  }

  copyToClipboard = () => {
    copy(this.state.txnId);
  };

  // load address to send payment
  loadAddressTo = event => {
    this.setState({
      addressTo: {
        value: event.target.value,
        isValid: true,
        message: "Please choose an address."
      }
    });
  };

  // load amount to send
  loadAmount = event => {
    this.setState({
      amount: event.target.value
    });
  };

  // load note to send
  loadNote = event => {
    this.setState({
      note: event.target.value
    });
  };

  // load number of address needed to send
  loadNumOfAddress = event => {
    this.setState({
      numOfAddress: event.target.value
    });
  };

  // load threshold needed to send
  loadThreshold = event => {
    this.setState({
      threshold: event.target.value
    });
  };

  componentDidMount() {
    $('[data-toggle="tooltip"]').tooltip();
  }

  componentDidUpdate() {
    $('[data-toggle="tooltip"]').tooltip();
  }

  // this will create a list of account based on the number of account user entered
  createAccounts = () => {
    let addressList = [];
    for (let i = 1; i <= this.state.numOfAddress; i++) {
      // generating and pushing account
      addressList.push(algosdk.generateAccount());
    }

    //Setup the parameters for the multisig account
    const mparams = {
      version: 1,
      threshold: Number.parseInt(this.state.threshold),
      addrs: addressList.map(account => account.addr)
    };

    let multsigaddr = algosdk.multisigAddress(mparams);
    console.log("Multisig Address: " + multsigaddr);

    // console.log(addressList);
    this.setState(
      {
        accountList: addressList,
        mparams: mparams,
        multsigaddr: multsigaddr,
        accountCreated: true
      },
      () => {
        alert("Make sure address above has tokens using the dispenser");
      }
    );
  };

  // validating the sender account and also sending the transaction
  sendTransaction = async () => {
    let hasBalance = await this.checkBalance(this.state.multsigaddr);
    if (this.state.addressTo.value === "") {
      this.setState({
        addressTo: {
          value: "",
          isValid: false,
          message: "Please choose an address."
        }
      });
    } else if (!algosdk.isValidAddress(this.state.addressTo.value)) {
      this.setState({
        addressTo: {
          value: "",
          isValid: false,
          message: "Please choose a valid address."
        }
      });
    } else if (hasBalance) {
      alert(this.state.multsigaddr + " does not have sufficient balance...");
    } else {
      this.startTransaction(
        this.state.accountList,
        this.state.multsigaddr,
        this.state.mparams
      ).catch(e => {
        console.log(e);
      });
    }
  };

  // check balance in the account
  checkBalance = async (account) => {
    let balance = (await AlgorandClient.accountInformation(
      account
    )).amount;
    console.log(balance + " " + account);
    return balance === 0;
  };

  // starting transaction here with the account from
  startTransaction = async (accountList, multsigaddr, mparams) => {
    //Get the relevant params from the algod
    try {
      let params = await AlgorandClient.getTransactionParams();
      let endRound = params.lastRound + parseInt(1000);

      //create a transaction
      let txn = {
        from: multsigaddr,
        to: this.state.addressTo.value,
        fee: params.fee,
        amount: Number.parseInt(this.state.amount),
        firstRound: params.lastRound,
        lastRound: endRound,
        genesisID: params.genesisID,
        genesisHash: params.genesishashb64,
        note: algosdk.encodeObj(this.state.note)
      };
      console.log(txn);
      //Sign wiith first signature
      let rawSignedTxn = [];
      rawSignedTxn[0] = algosdk.signMultisigTransaction(
        txn,
        mparams,
        accountList[0].sk
      ).blob;
      for (let i = 1; i < this.state.threshold; i++) {
        console.log(rawSignedTxn[i-1], mparams, accountList[i])
        //sign with second account
        rawSignedTxn[i] = algosdk.appendSignMultisigTransaction(
          rawSignedTxn[i - 1],
          mparams,
          accountList[i].sk
        ).blob;
        console.log(accountList[i].addr);
      }
      //submit the transaction
      AlgorandClient.sendRawTransaction(rawSignedTxn[rawSignedTxn.length - 1])
        .then(tx => {
          console.log(tx);
          this.setState({
            txnId: tx.txId,
            addressTo: {
              value: "",
              isValid: true,
              message: "Please choose an address."
            },
            amount: 0,
            note: "",
            numOfAddress: 1,
            threshold: 1,
            accountCreated: false,
            accountList: [],
            multsigaddr: "",
            mparams: {}
          });
        })
        .catch(err => {
          console.log(err);
          // setting the error text to state
          this.setState({ errorMessage: err.text });
        });
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <div>
        <div
          style={{ padding: "4em" }}
          className="rounded-lg shadow border bg-light p-4"
        >
          <div className="form-group text-center">
            <h3>Send Transaction</h3>
          </div>
          <div className="form-group">
            <label>Address To</label>
            <input
              type="text"
              className={
                "form-control " +
                (this.state.addressTo.isValid ? null : "is-invalid")
              }
              id="addressTo"
              aria-describedby="adressToHelp"
              placeholder="Enter address"
              value={this.state.addressTo.value}
              onChange={this.loadAddressTo}
            />
            <div className="invalid-feedback">
              {this.state.addressTo.message}
            </div>
          </div>
          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              className="form-control"
              id="amount"
              placeholder="0 (in microAlgos)"
              value={this.state.amount}
              onChange={this.loadAmount}
            />
          </div>
          <div className="form-group">
            <label>Note</label>
            <textarea
              rows="3"
              className="form-control"
              id="note"
              placeholder="write note"
              value={this.state.note}
              onChange={this.loadNote}
            />
          </div>
          <div className="form-group">
            <label>Number of address</label>
            <input
              type="number"
              className="form-control"
              id="numOfAddress"
              placeholder="1"
              value={this.state.numOfAddress}
              onChange={this.loadNumOfAddress}
            />
          </div>

          <div className="form-group">
            <label>Threshold</label>
            <input
              type="number"
              className="form-control"
              id="threshold"
              placeholder="1"
              value={this.state.threshold}
              onChange={this.loadThreshold}
            />
          </div>

          <div className="form-group">
            <SuggestedFeeComponent />
          </div>
          {this.state.accountList.length !== 0 ? (
            <div className="form-group">
              <div>
                <label>Created Account</label>
              </div>
              {this.state.accountList.map(account => (
                <div className="badge badge-secondary" key={account.addr}>
                  {account.addr}
                </div>
              ))}
            </div>
          ) : null}

          {this.state.multsigaddr !== "" ? (
            <div className="form-group">
              <div>
                <label>Created Multisig Address</label>
              </div>
              <div className="badge badge-secondary">
                {this.state.multsigaddr}
              </div>
            </div>
          ) : null}

          <div className="d-flex justify-content-around">
            {this.state.accountCreated ? (
              <button
                type="button"
                className="btn btn-dark px-4 mt-2"
                onClick={this.sendTransaction}
              >
                Send
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-dark px-4 mt-2"
                onClick={this.createAccounts}
              >
                Create Accounts
              </button>
            )}
          </div>
        </div>
        {this.state.txnId !== "" ? (
          <div className="rounded-lg shadow border bg-light p-4 mt-3">
            <div className="text-success font-weight-bold">
              Transaction Sent
            </div>
            <div className="text-secondary">
              <span className="font-weight-bold">txnId: </span>
              <span
                data-toggle="tooltip"
                data-placement="bottom"
                data-html="true"
                title={
                  "<div>Copy to clipboard</div><div>" +
                  this.state.txnId +
                  "</div>"
                }
                onClick={this.copyToClipboard}
              >
                {this.state.txnId.substr(0, 10)}...
                {this.state.txnId.substr(-4, 4)}
              </span>
            </div>
          </div>
        ) : null}
        {this.state.errorMessage !== "" ? (
          <div className="rounded-lg shadow border bg-light p-4 my-3">
            <div className="text-danger font-weight-bold">Error</div>
            <div className="text-secondary">
              <span className="font-weight-bold">message: </span>
              <span>{this.state.errorMessage}</span>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
