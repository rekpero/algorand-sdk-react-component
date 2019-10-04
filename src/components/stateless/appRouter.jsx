import * as React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import App from "../../App";
import CreateAccountPage from "../pages/createaccountpage";
import TransactionPage from "../pages/transactionpage";
import RestoreAccountPage from "../pages/restoreaccountcomponent";
import AccountPage from "../pages/accountpage";

const AppRouter = () => {
  return (
    <Router>
      <App>
        <Route path="/create" render={CreateAccountPage} />
        <Route path="/restore" render={RestoreAccountPage} />
        <Route path="/account" render={() => <AccountPage />} />
        <Route path="/transaction" render={() => <TransactionPage />} />
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
