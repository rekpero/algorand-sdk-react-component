import * as React from "react";
import AlgorandClient from "../../services/algorandsdk";
import caution from "../../assets/images/caution.svg";

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
      secPerBlock: 4.5,
      predictedRound: 0,
      predLoadStart: false,
      predLoadEnd: false
    };
  }
  componentDidMount() {
    let today = new Date();
    // configuring todays date
    let todayDate =
      today.getFullYear() +
      "-" +
      ("0" + (today.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + today.getDate()).slice(-2);

    // configure current time
    let todayTime =
      ("0" + today.getHours()).slice(-2) +
      ":" +
      ("0" + today.getMinutes()).slice(-2);

    this.setState({ date: todayDate, time: todayTime }, () => {
      console.log(this.state.time);
    });
  }

  // start predicting round range
  getRoundRange = () => {
    this.setState({ predLoadStart: true }, () => {
      this.calculateBlock();
    });
  };

  // load date
  loadDate = e => {
    this.setState({ date: e.target.value }, () => {
      console.log(this.state.date);
    });
  };

  // load time
  loadTime = e => {
    this.setState({ time: e.target.value }, () => {
      console.log(this.state.time);
    });
  };

  // load period
  loadSecPerBlock = e => {
    this.setState({ secPerBlock: e.target.value }, () => {
      console.log(this.state.secPerBlock);
    });
  };

  // calculate round range based on datetime entered
  calculateBlock = async () => {
    // calculate block per sec from the input
    const blockPerSec = 1 / (this.state.secPerBlock * 1000);

    // get the end round
    const params = await AlgorandClient.getTransactionParams();
    const round = params.lastRound;

    // get the entered date timestamp and find diff between current datetime and entered datetime
    const dateGiven = new Date(this.state.date + " " + this.state.time);
    const dateDiff = Math.abs(dateGiven.getTime() - new Date().getTime());

    // predict the round range on endered datetime
    const predictedRound = Math.ceil(dateDiff * blockPerSec) + round;

    console.log(blockPerSec, round, predictedRound);

    this.setState({
      predictedRound,
      predLoadStart: false,
      predLoadEnd: true
    });
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
        <div className="form-group">
          <label className="d-flex">
            Sec per block
            <img
              className="ml-auto"
              src={caution}
              alt="caution"
              style={{ height: 16, width: 16 }}
              data-toggle="tooltip"
              data-placement="bottom"
              title="Please change this field after getting confirmation from the algorand team"
            />
          </label>

          <input
            type="number"
            className="form-control"
            value={this.state.secPerBlock}
            onChange={this.loadSecPerBlock}
          />
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
