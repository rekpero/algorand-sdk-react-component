import * as React from "react";
import AlgorandClient from "../../services/algorandsdk";

/**
 * This component will show you predicted round range based on datetime entered in the input.
 * @state date: string -> load the date entered
 * @state time: string -> load the time entered
 * @state predictedRound: number -> store the predicted round start
 * @state predLoadStart: boolean -> true when starting prediction
 * @state predLoadEnd: boolean -> true at the end of prediction
 *
 * @author [Mitrasish Mukherjee](https://github.com/mmitrasish)
 */
export default class PredictedRoundRangeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: "",
      time: "",
      predictedRound: 0,
      predLoadStart: false,
      predLoadEnd: false
    };
  }
  componentDidMount() {
    let today = new Date();
    let todayDate =
      today.getFullYear() +
      "-" +
      ("0" + (today.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + today.getDate()).slice(-2);

    let todayTime =
      ("0" + today.getHours()).slice(-2) +
      ":" +
      ("0" + today.getMinutes()).slice(-2);

    this.setState({ date: todayDate, time: todayTime }, () => {
      console.log(this.state.time);
    });
  }
  getRoundRange = () => {
    this.setState({ predLoadStart: true }, () => {
      this.calculateAverageRoundPerSec();
    });
  };

  loadDate = e => {
    this.setState({ date: e.target.value }, () => {
      console.log(this.state.date);
    });
  };

  loadTime = e => {
    this.setState({ time: e.target.value }, () => {
      console.log(this.state.time);
    });
  };

  calculateAverageRoundPerSec = async () => {
    console.log("Started");
    let params = await AlgorandClient.getTransactionParams();
    let startTime = Date.now();
    let round1 = params.lastRound;
    console.log(round1);
    setTimeout(async () => {
      let params = await AlgorandClient.getTransactionParams();
      let endTime = Date.now();
      let round2 = params.lastRound;
      console.log(round2);
      let diffRound = round2 - round1;
      let timeTaken = endTime - startTime;
      const roundTimeRatio = diffRound / timeTaken;
      const dateGiven = new Date(this.state.date + " " + this.state.time);
      const dateDiff = Math.abs(dateGiven.getTime() - new Date().getTime());
      const predictedRound = Math.ceil(dateDiff * roundTimeRatio) + round2;
      console.log(roundTimeRatio, dateDiff, predictedRound);
      this.setState({
        predictedRound,
        predLoadStart: false,
        predLoadEnd: true
      });
    }, 6000);
  };
  render() {
    return (
      <div
        style={{ padding: "4em" }}
        className="rounded-lg shadow border bg-light p-4"
      >
        <div className="form-group text-center">
          <h3>Predict Round Range</h3>
        </div>
        <div className="form-group text-center">
          <div className="row">
            <div className="col-md-6">
              <input
                type="date"
                className="form-control"
                value={this.state.date}
                onChange={this.loadDate}
              />
            </div>
            <div className="col-md-6">
              <input
                type="time"
                className="form-control"
                defaultValue={this.state.time}
                onChange={this.loadTime}
              />
            </div>
          </div>
        </div>
        <div className="form-group text-center">
          <button
            type="button"
            className="btn btn-dark px-4 mt-2"
            onClick={e => this.getRoundRange()}
          >
            Get round range
          </button>
        </div>
        <div className="form-group text-center">
          {this.state.predLoadStart ? (
            <div className="spinner-border text-info" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          ) : this.state.predLoadEnd ? (
            <div>
              <div>Predicted Round Range: </div>
              <h4>
                {this.state.predictedRound} - {this.state.predictedRound + 1000}
              </h4>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
