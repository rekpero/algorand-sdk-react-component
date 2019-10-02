import * as React from "react";
import algosdk from "algosdk";
import { withRouter, Link } from "react-router-dom";

class RestoreAccountComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mnemonic: ""
    };
  }

  loadMnemonic = event => {
    this.setState({ mnemonic: event.target.value });
  };

  restoreAccount = async () => {
    var keys = algosdk.mnemonicToSecretKey(this.state.mnemonic);
    console.log(keys);

    localStorage.setItem("address", keys.addr);
    localStorage.setItem("mnemonic", this.state.mnemonic);

    let accountList = JSON.parse(localStorage.getItem("accountList")) || [];
    accountList.push({
      address: keys.addr,
      mnemonic: this.state.mnemonic
    });
    localStorage.setItem("accountList", JSON.stringify(accountList));

    this.props.history.push("/account");
  };

  render() {
    return (
      <div className="d-flex justify-content-center">
        <div className="col-md-4">
          <div
            style={{ marginTop: "5em", padding: "4em" }}
            className="rounded-lg shadow border bg-secondary text-white"
          >
            <div className="form-group">
              <label>Mnemonic</label>
              <textarea
                rows="4"
                className="form-control"
                id="mnemonic"
                placeholder="write your mnemonic"
                value={this.state.mnemonic}
                onChange={this.loadMnemonic}
              />
            </div>
            <div className="form-group mb-4">
              <button
                type="button"
                className="btn btn-outline-light col-md-12"
                onClick={this.restoreAccount}
              >
                Restore Account
              </button>
            </div>
            <hr className="bg-white" />
            <div className="text-center mt-4">
              <span>
                Don't have an account?{" "}
                <Link to="/create" className="btn btn-outline-light ml-2">
                  Create Account
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(RestoreAccountComponent);
