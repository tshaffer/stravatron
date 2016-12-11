import React, { Component } from 'react';
import { Link } from 'react-router';
import { hashHistory } from 'react-router';
let moment = require('moment');

import * as Converters from '../utilities/converters';

import ActivityMap from './activityMap';
import InteractiveElevationChart from './interactiveElevationChart';

export default class DetailedActivity extends Component {

  constructor(props) {
    super(props);
    this.state = {
      reportClickLocation: false,
      distance: 32
    };
  }

  componentWillMount() {
    this.props.onLoadDetailedActivity(this.props.params.id);
  }

  buildRideSummaryHeader(activity) {

    if (!activity) {
      return <div>Loading</div>;
    }

    let calories = "";
    if (activity.kilojoules) {
      calories = activity.kilojoules.toFixed(0);
    }

    return (
      <div id="RideSummary">
        <table className="summaryTable">

          <tbody>

            <tr className="summaryDataRow">
              <td>{activity.name}</td>
              <td>{Converters.getMovingTime(activity.movingTime)}</td>
              <td>{Converters.metersToFeet(activity.totalElevationGain).toFixed(0)} ft</td>
              <td>{Converters.metersToMiles(activity.distance).toFixed(1)} mi</td>
              <td>{Converters.metersPerSecondToMilesPerHour(activity.averageSpeed).toFixed(1)} mph</td>
              <td>{calories}</td>
            </tr>

            <tr className="summaryLabels">
              <td>{Converters.getDateTime(activity.startDateLocal)}</td>
              <td>Time</td>
              <td>Elevation</td>
              <td>Distance</td>
              <td>Speed</td>
              <td>Calories</td>
            </tr>

          </tbody>
        </table>
      </div>
    );
  }

  analyzeEffortsForSegment(effortsForSegment) {

    let effortsSortedByMovingTime = effortsForSegment.concat();
    let effortsSortedByDate = effortsForSegment.concat();

    // 'best time' by sorting efforts by movingTime
    effortsSortedByMovingTime.sort( (a, b) => {

      const aMovingTime = Number(a.movingTime);
      const bMovingTime = Number(b.movingTime);

      if (aMovingTime > bMovingTime) {
        return 1;
      }
      if (aMovingTime < bMovingTime) {
        return -1;
      }
      return 0;
    });

    // most recent will be first in the array
    effortsSortedByDate.sort( (a, b) => {

      const aDate = a.startDateLocal;
      const bDate = b.startDateLocal;

      if (aDate < bDate) {
        return 1;
      }
      if (aDate > bDate) {
        return -1;
      }
      return 0;
    });

    const analyzedEffortsForSegment =
      {
        effortsSortedByMovingTime,
        effortsSortedByDate
      };

    return analyzedEffortsForSegment;
  }

  handleAllActivitiesWithThisSegment(segmentId) {
    console.log("handleAllActivitiesWithThisSegment: ", segmentId.toString());
    hashHistory.push('/segmentsSummaryActivitiesContainer/' + segmentId);
  }

  handleDistanceChange(_, __, distance) {
    this.setState({distance});
  }

  handleToggleShowNearby() {
    // this.props.onToggleReportClickLocation();
    this.setState({reportClickLocation: !this.state.reportClickLocation});
  }

  handleMapClick(location) {
    console.log("handleClickLocation");
    console.log(location);

    let targetRegion = {};
    targetRegion.location = location;

    targetRegion.distance = Number(this.txtBoxDistance.value);

    // double check that user is in a 'Show Nearby' operation
    if (this.state.reportClickLocation) {
      hashHistory.push('/nearLocationSummaryActivitiesContainer/' + JSON.stringify(targetRegion));
    }
  }

  buildSegmentEffortRow(segmentEffort) {

    let self = this;

    const segmentId = segmentEffort.segmentId;
    const segment = this.props.segments.segmentsById[segmentId];

    const speed = segmentEffort.distance / segmentEffort.movingTime;

    let averageGrade = "";
    if (segment && segment.averageGrade) {
      averageGrade = segment.averageGrade.toFixed(1) + '%';
    }

    let totalElevationGain = "";
    if (segment && segment.totalElevationGain) {
      totalElevationGain = Converters.metersToFeet(segment.totalElevationGain).toFixed(0) + "ft";
    }

    let effortsForSegmentLbl = "none";
    let recentEffortsLbl = "none";
    if (this.props.effortsForSegments) {
      const effortsForSegment = this.props.effortsForSegments[segmentId];
      if (effortsForSegment) {
        if (effortsForSegment.length > 0) {

          const effortData = this.analyzeEffortsForSegment(effortsForSegment);

          const bestEffortTime = moment().startOf('day')
            .seconds(Number(effortData.effortsSortedByMovingTime[0].movingTime))
            .format('mm:ss');

          const bestEffortDate = moment(effortData.effortsSortedByMovingTime[0].startDateLocal).format('YYYY-MM-DD');

          effortsForSegmentLbl =
            (
              <span>
                <span>{bestEffortTime}</span>
                <span className="smallDimDate">{bestEffortDate}</span>
              </span>
            );

          if (effortData.effortsSortedByMovingTime[1]) {

            const nextBestEffortTime = moment().startOf('day')
              .seconds(Number(effortData.effortsSortedByMovingTime[1].movingTime))
              .format('mm:ss');
            const nextBestEffortDate =
              moment(effortData.effortsSortedByMovingTime[1].startDateLocal).format('YYYY-MM-DD');

            effortsForSegmentLbl =
              (
                <span>
                  <span>{bestEffortTime}</span>
                  <span className="smallDimDate">{bestEffortDate}</span>
                  <span>, {nextBestEffortTime}</span>
                  <span className="smallDimDate">{nextBestEffortDate}</span>
                </span>
              );
          }

          // effortsSortedByDate
          let recentEfforts = [];
          let recentEffort =
            {
              movingTime: '',
              date: '',
              separator: ''
            };

          recentEfforts.push(recentEffort);
          recentEfforts.push(recentEffort);
          recentEfforts.push(recentEffort);

          let index = 0;
          while (index < 3) {
            if (effortData.effortsSortedByDate.length > (index + 1)) {
              const effort = effortData.effortsSortedByDate[index + 1];
              recentEfforts[index] =
              {
                movingTime: effort.movingTime,
                date: effort.startDateLocal,
                separator: ', '
              };
            }
            index++;
          }

          recentEffortsLbl =
            (
              <span>
                <span>{Converters.elapsedTimeToTimeString(recentEfforts[0].movingTime)}</span>
                <span className="smallDimDate">{Converters.formatDate(recentEfforts[0].date)}</span>
                <span>{recentEfforts[1].separator}</span>
                <span>{Converters.elapsedTimeToTimeString(recentEfforts[1].movingTime)}</span>
                <span className="smallDimDate">{Converters.formatDate(recentEfforts[1].date)}</span>
                <span>{recentEfforts[2].separator}</span>
                <span>{Converters.elapsedTimeToTimeString(recentEfforts[2].movingTime)}</span>
                <span className="smallDimDate">{Converters.formatDate(recentEfforts[2].date)}</span>
              </span>
            );
        }
      }
    }

    return (
      <tr key={segmentEffort.id}>
        <td>
          {segmentEffort.name}
        </td>
        <td>
          {Converters.getMovingTime(segmentEffort.movingTime)}
        </td>
        <td>
          {effortsForSegmentLbl}
        </td>
        <td>
          {recentEffortsLbl}
        </td>
        <td>
          {Converters.metersToMiles(segmentEffort.distance).toFixed(1)} mi
        </td>
        <td>
          {Converters.metersPerSecondToMilesPerHour(speed).toFixed(1)} mph

        </td>
        <td>
          {averageGrade}
        </td>
        <td>
          {totalElevationGain}
        </td>
        <td>
          <button onClick={() => {
            self.handleAllActivitiesWithThisSegment(segment.id);
          }
          }>Show all...</button>
        </td>
      </tr>
    );
  }

  buildSegmentEffortRows(segmentEfforts) {

    const self = this;


    segmentEfforts.forEach( (segmentEffort) => {
      self.buildSegmentEffortRow(segmentEffort);
    });

    let segmentEffortRows = segmentEfforts.map(function(segmentEffort) {
      const segmentEffortRow = self.buildSegmentEffortRow(segmentEffort);
      return segmentEffortRow;
    });
    return segmentEffortRows;
  }

  buildSegmentEffortsTable() {

    const segmentEffortRows = this.buildSegmentEffortRows(this.props.segmentEffortsForActivity);

    // <th>&Delta; Best Times</th>
    // <th>&#x394;</th>
    return (

      <div id="DetailedActivity" className="detailsActivity">
        <table id="DetailedActivityTable" className="detailsActivityTable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Time</th>
              <th>Best Times</th>
              <th>Recent Efforts</th>
              <th>Distance</th>
              <th>Speed</th>
              <th>Average Grade</th>
              <th>Elevation Gain</th>
              <th/>
            </tr>
          </thead>
          <tbody>
            {segmentEffortRows}
          </tbody>
        </table>
      </div>

    );
  }

  render () {

    const self = this;

    const activity = this.props.activity;

    if (!activity || this.props.segmentEffortsForActivity.length === 0) {
      return <div>Loading...</div>;
    }

    let mapPolyline = "";
    if (activity.mapPolyline) {
      mapPolyline = activity.mapPolyline;
    }
    else {
      return <div>Loading...</div>;
    }

    const activityData =
      {
        polyline: mapPolyline,
        strokeColor: "red"
      };
    const activitiesData = [activityData];

    let streams = [];
    if (activity.streams) {
      streams = activity.streams;
    }
    else {
      return <div>Loading...</div>;
    }

    const rideSummaryHeader = this.buildRideSummaryHeader(activity);
    const segmentEffortsTable = this.buildSegmentEffortsTable();

    return (
      <div>
        <Link to="/allSummaryActivitiesContainer" id="backFromDetailedActivityButton">Back</Link>
        <br/>
        {rideSummaryHeader}

        <button onClick={self.handleToggleShowNearby.bind(self)}>
          Show Nearby
        </button>
        Distance:
        <input type="text" id="txtBoxDistance" className="distanceText"
          value={this.state.distance}
          onChange={this.handleDistanceChange.bind(this)}
          ref={(c) => {
            self.txtBoxDistance = c;
          }}
        />
        <ActivityMap
          activitiesData={activitiesData}
          totalActivities={1}
          mapHeight={"400px"}
          markerCount={1}
          activityLocations={this.props.activityLocations}
          locationCoordinates={this.props.locationCoordinates}
          reportClickLocation={this.state.reportClickLocation}
          onMapClick={this.handleMapClick.bind(this)}
        />
        <InteractiveElevationChart
          streams={streams}
          activityStartDateLocal={activity.startDateLocal}
          segmentEffortsForActivity={this.props.segmentEffortsForActivity}
          onSetLocationCoordinates={this.props.onSetLocationCoordinates.bind(this)}
          activityLocations={this.props.activityLocations}
        />

        {segmentEffortsTable}
      </div>
    );
  }
}

DetailedActivity.propTypes = {
  onLoadDetailedActivity: React.PropTypes.func.isRequired,
  activity: React.PropTypes.object.isRequired,
  segments: React.PropTypes.object.isRequired,
  segmentEfforts: React.PropTypes.object.isRequired,
  effortsForSegments: React.PropTypes.object.isRequired,
  segmentEffortsForActivity: React.PropTypes.array.isRequired,
  params: React.PropTypes.object.isRequired,
  activityLocations: React.PropTypes.array.isRequired,
  onSetLocationCoordinates: React.PropTypes.func.isRequired,
  locationCoordinates: React.PropTypes.object.isRequired,
  // onToggleReportClickLocation: React.PropTypes.func.isRequired
};
