import * as React from "react";
import AlgorandClient from "../../services/algorandsdk";

/**
 * This component will show you suggested fee.
 * @state suggestedFee: number -> store suggessted fee from the sdk
 *
 * @author [Mitrasish Mukherjee](https://github.com/mmitrasish)
 */
export default class SuggestedFeeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestedFee: 0
    };
  }
  componentDidMount = async () => {
    // getting the suggested fee
    let suggestedFee = await AlgorandClient.suggestedFee();
    this.setState({ suggestedFee: suggestedFee.fee * 1000 });
  };
  render() {
    return (
      <div>
        <label>Fees: </label>
        <span className="ml-2">{this.state.suggestedFee} microAlgos</span>
      </div>
    );
  }
}
