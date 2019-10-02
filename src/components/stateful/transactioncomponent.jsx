import * as React from "react";
import algosdk from "algosdk";
import $ from "jquery";
import AlgorandClient from "../../services/algorandsdk";
import copy from "clipboard-copy";

export default class TransactionComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addressTo: {
        value: "",
        isValid: true,
        message: "Please choose an address."
      },
      amount: 0,
      note: "",
      txtId: ""
    };
  }

  copyToClipboard = () => {
    copy(this.state.txtId);
  };

  loadAddressTo = event => {
    this.setState({
      addressTo: {
        value: event.target.value,
        isValid: true,
        message: "Please choose an address."
      }
    });
  };

  loadAmount = event => {
    this.setState({
      amount: event.target.value
    });
  };

  loadNote = event => {
    this.setState({
      note: event.target.value
    });
  };

  componentDidMount() {
    $('[data-toggle="tooltip"]').tooltip();
  }

  componentDidUpdate() {
    $('[data-toggle="tooltip"]').tooltip();
  }

  sendTransaction = () => {
    console.log(this.state.amount);
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
    } else {
      let mnemonic = localStorage.getItem("mnemonic");
      let recoveredAccount = algosdk.mnemonicToSecretKey(mnemonic);

      this.startTransaction(recoveredAccount).catch(e => {
        console.log(e);
      });
    }
  };

  startTransaction = async recoveredAccount => {
    //Get the relevant params from the algod
    let params = await AlgorandClient.getTransactionParams();
    let endRound = params.lastRound + parseInt(1000);

    //create a transaction
    let txn = {
      from: recoveredAccount.addr,
      to: this.state.addressTo.value,
      fee: params.fee,
      amount: Number.parseInt(this.state.amount),
      firstRound: params.lastRound,
      lastRound: endRound,
      genesisID: params.genesisID,
      genesisHash: params.genesishashb64,
      note: algosdk.encodeObj(this.state.note)
    };

    //sign the transaction
    let signedTxn = algosdk.signTransaction(txn, recoveredAccount.sk);

    let tx = await AlgorandClient.sendRawTransaction(signedTxn.blob);

    this.setState({
      txtId: tx.txId,
      addressTo: {
        value: "",
        isValid: true,
        message: "Please choose an address."
      },
      amount: 0,
      note: ""
    });
  };

  render() {
    return (
      <div className="d-flex justify-content-center">
        <div className="col-md-4">
          <div
            style={{ marginTop: "5em", padding: "4em" }}
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
                placeholder="0"
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
            <div className="text-center">
              <button
                type="button"
                className="btn btn-dark px-4 mt-2"
                onClick={this.sendTransaction}
              >
                Send
              </button>
            </div>
          </div>
          {this.state.txtId !== "" ? (
            <div className="rounded-lg shadow border bg-light p-4 mt-3">
              <div className="text-success font-weight-bold">
                Transaction Sent
              </div>
              <div className="text-secondary">
                <span className="font-weight-bold">txtId: </span>
                <span
                  data-toggle="tooltip"
                  data-placement="bottom"
                  data-html="true"
                  title={
                    "<div>Copy to clipboard</div><div>" +
                    this.state.txtId +
                    "</div>"
                  }
                  onClick={this.copyToClipboard}
                >
                  {this.state.txtId.substr(0, 10)}...
                  {this.state.txtId.substr(-4, 4)}
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
