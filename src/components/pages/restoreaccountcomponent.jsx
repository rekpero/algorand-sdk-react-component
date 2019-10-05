import * as React from "react";
import { withRouter, Link } from "react-router-dom";
import RestoreAccountButton from "../stateless/restoreaccountbutton";

/**
 * This component will restore your account given mnemonic
 * @state mnemonic: string -> store account mnemonic from textarea
 *
 * @author [Mitrasish Mukherjee](https://github.com/mmitrasish)
 */
class RestoreAccountPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mnemonic: ""
    };
  }

  // load mnemonic from user
  loadMnemonic = event => {
    this.setState({ mnemonic: event.target.value });
  };

  // getting the restored account keys from restoreaccountbutton component and pushing it to localstorage
  restoreAccount = keys => {
    console.log(keys);

    // adding to localstorage
    localStorage.setItem("address", keys.addr);
    localStorage.setItem("mnemonic", this.state.mnemonic);

    // pushing account to localstorage account list
    let accountList = JSON.parse(localStorage.getItem("accountList")) || [];
    accountList.push({
      address: keys.addr,
      mnemonic: this.state.mnemonic
    });
    localStorage.setItem("accountList", JSON.stringify(accountList));

    // redirecting to account page
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
              <RestoreAccountButton
                restoreAccount={this.restoreAccount}
                mnemonic={this.state.mnemonic}
              />
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
          <div className="text-center text-secondary mt-4">
            Powered by Algorand
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(RestoreAccountPage);
