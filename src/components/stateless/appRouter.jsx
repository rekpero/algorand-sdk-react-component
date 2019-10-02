import * as React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import App from "../../App";
import CreateAccountComponent from "./createaccountcomponent";
import AccountComponent from "../stateful/accountcomponent";
import TransactionComponent from "../stateful/transactioncomponent";
import RestoreAccountComponent from "../stateful/restoreaccountcomponent";

const AppRouter = () => {
  return (
    <Router>
      <App>
        <Route path="/create" render={CreateAccountComponent} />
        <Route path="/restore" render={RestoreAccountComponent} />
        <Route path="/account" render={() => <AccountComponent />} />
        <Route path="/transaction" render={() => <TransactionComponent />} />
        <Route
          exact
          path="/"
          render={() =>
            localStorage.getItem("address") !== null ? (
              <Redirect to="/account" />
            ) : (
              <Redirect to="/create" />
            )
          }
        />
      </App>
    </Router>
  );
};
export default AppRouter;
