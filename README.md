# Algorand React

<img src="https://raw.githubusercontent.com/mmitrasish/algorand-sdk-react-component/master/src/assets/images/algorandicon.webp" width="100" height="100">

**Algorand React** is a set of reusuable component which is like a wrapper to Algorand JS SDK that can be used to create and restore account in algorand blockchain (https://www.algorand.com/) and also create, sign and send both online and offline transactions on algorand blockchain.

![Account Component](https://github.com/mmitrasish/algorand-sdk-react-component/blob/master/src/assets/images/screenshots/Screenshot1.png)

## Features

* Account creation
* Account restoration with mnemonic
* Account transactions in the last 1000 round
* Multiple account handling
* Send Transaction Online
* Sending Transaction Signed Offline
* Getting suggested fees

## Usage Overview

There is a set of components that can be used:

* #### Creating Account using CreateAccountButton component

With the click of the button you can create an account and get the keys from the function

```javascript
// get the keys when you click the create button
let createAccount = keys => {
  console.log(keys)
};
render(){
  return( <CreateAccountButton createAccount={createAccount} />);
}
```

UI will only be the create button shown in the bellow screenshot:

![Restore Account Component](https://github.com/mmitrasish/algorand-sdk-react-component/blob/master/src/assets/images/screenshots/Screenshot3.png)

* #### Restoring Account with mnemonic using RestoreAccountButton component

With the click of the button you can restore the account you have using the mnemonic of account and get the keys from the function

```javascript
// get the keys when you click the restore button
let restoreAccount = keys => {
  console.log(keys)
};
render(){
  return(<RestoreAccountButton restoreAccount={this.restoreAccount} mnemonic={"your mnemonic"} />);
}
```

UI will only be the restore button shown in the bellow screenshot:

![Restore Account Component](https://github.com/mmitrasish/algorand-sdk-react-component/blob/master/src/assets/images/screenshots/Screenshot4.png)

* #### Show account details and all the transactions in the last 1000 round using AccountComponent component

This will show you all the details about account like balance, mnemonic, list of accounts, list of transactions in last 1000 round and list of account and also can change account if you have multiple accounts

```javascript
// get the account when you change it if you have multiple account
changeAccount = account => {
    console.log(account.address);
};
render(){
  return(<AccountComponent address={"Your address"} mnemonic={"Your mnemonic"} 
  accountList={[list of accounts]} changeAccount={this.changeAccount} />);
}
```

This will give a UI like this with both account details and recent transaction components: 

![Account Component](https://github.com/mmitrasish/algorand-sdk-react-component/blob/master/src/assets/images/screenshots/Screenshot5.png)

* #### Transactions can be done using TransactionComponent component

This will give you a form where users will be able to fill destination address, amount to pay and note. Also the user will be able to see the suggested fees. All the other fields like round range are not shown and will be pre filled during the start of transaction. You can also download the transaction for offline signing using the Sign Offline button which will give a json file which can be read when signing in offline machine using JS.

```javascript
render(){
  return(<TransactionComponent mnemonic={"Your mnemonic"} />);
}
```

* #### Offline Transactions can be send using TransactionOfflineComponent component

This will give you a form where users will be able to upload a offline signed transaction in json format which can be sent using algorand client sdk. This component can also be used to sign participant key registration by getting the signed transaction in json format and upload it in this component

```javascript
render(){
  return(<TransactionOfflineComponent />);
}
```

The transaction component will give a UI like this with both online and offline transaction components: 

![Account Component](https://github.com/mmitrasish/algorand-sdk-react-component/blob/master/src/assets/images/screenshots/Screenshot2.png)

## Dependencies

1. React v16.10.1
1. React Router Dom v5.0.1
1. Algosdk v1.3.1
1. Bootstrap v4.3.1
1. Jquery v3.4.1
1. Popper.js v1.15.0
1. clipboard-copy v3.1.0

## Licence

[LICENSE](https://github.com/mmitrasish/algorand-sdk-react-component/blob/master/LICENSE)
