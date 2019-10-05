import * as React from "react";
import $ from "jquery";
import AlgorandClient from "../../services/algorandsdk";
import copy from "clipboard-copy";

/**
 * This component is used to send offline transaction using file provided by the user
 *
 * @state txnFile: File -> store txn file
 * @state fileName: string -> store file name from input
 * @state txn: string -> store txn json
 * @state txnId: string -> store transaction id after the transaction is complete
 * @state errorMessage: string -> store error message if there is any error during transaction
 *
 * @author [Mitrasish Mukherjee](https://github.com/mmitrasish)
 */
export default class TransactionOfflineComponent extends React.Component {
  fileReader;
  constructor(props) {
    super(props);
    this.state = {
      txnFile: "",
      fileName: "Choose offline signed txn file",
      txn: "",
      txnId: "",
      errorMessage: ""
    };
  }

  // copy transaction
  copyToClipboard = () => {
    copy(this.state.txnId);
  };

  // load signed txn
  loadTxnFile = event => {
    this.handleFile(event.target.files[0]);
  };

  // set txn json to state
  handleFileRead = e => {
    const content = this.fileReader.result;
    this.setState({ txn: content });
  };

  // load file to json
  handleFile = file => {
    this.setState({ fileName: file.name });
    this.fileReader = new FileReader();
    this.fileReader.onloadend = this.handleFileRead;
    this.fileReader.readAsText(file);
  };

  componentDidMount() {
    $('[data-toggle="tooltip"]').tooltip();
  }

  componentDidUpdate() {
    $('[data-toggle="tooltip"]').tooltip();
  }

  // sending the offline signed txn
  sendTransaction = () => {
    let signedTxn = JSON.parse(this.state.txn);
    console.log(Object.values(signedTxn.blob));

    this.startTransaction(Object.values(signedTxn.blob)).catch(e => {
      console.log(e);
    });
  };

  // starting transaction here with the signed transaction
  startTransaction = async signedTxn => {
    // sending the transaction
    AlgorandClient.sendRawTransaction(signedTxn)
      .then(tx => {
        console.log(tx);
        this.setState({
          txnId: tx.txId,
          txn: null
        });
      })
      .catch(err => {
        console.log(err);
        // setting the error text to state
        this.setState({ errorMessage: err.text });
      });
  };

  render() {
    return (
      <div>
        <div className="rounded-lg shadow border bg-light p-4">
          <div className="form-group text-center">
            <h3>Send Offline Transaction</h3>
          </div>
          <div className="form-group">
            <label>Offline Signed Txn</label>
            <div className="custom-file">
              <input
                type="file"
                className="custom-file-input"
                id="txtFile"
                aria-describedby="transactionFile"
                value={this.state.txnFile}
                onChange={this.loadTxnFile}
              />
              <label className="custom-file-label">{this.state.fileName}</label>
            </div>
          </div>
          <div className="d-flex justify-content-around">
            <button
              type="button"
              className="btn btn-dark px-4 mt-2"
              onClick={this.sendTransaction}
            >
              Send Offline
            </button>
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
