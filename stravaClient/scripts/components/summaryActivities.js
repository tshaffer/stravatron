import React, { Component } from 'react';
import { Link } from 'react-router';

import * as Converters from '../utilities/converters';

class SummaryActivities extends Component {

  handleShowDetailedMap(activityId) {
    this.props.onShowDetailedMap(activityId);
  }

  handleCreateSegments(activityId) {
    this.props.onCreateSegments(activityId);
  }

  handleMapStarredSegments() {
    this.props.onMapStarredSegments();
  }

  handleMapSelectedRides() {

    let selectedActivityIds = [];

    for (const activityId in this.props.activities.activitiesById) {
      if (this.props.activities.activitiesById.hasOwnProperty(activityId)) {
        if (document.getElementById(activityId).checked) {
          selectedActivityIds.push(activityId);
        }
      }
    }

    if (selectedActivityIds.length === 0) return;

    this.props.onMapSelectedRides(selectedActivityIds);
  }

  buildSummaryActivityRow(activity) {

    var self = this;

    let calories = "";
    if (activity.kilojoules) {
      calories = activity.kilojoules.toFixed(0);
    }

    return (
      <tr key={activity.id}>
        <td>
          <input type='checkbox' id={activity.id} ref={(c) => { this[activity.id] = c; }}/>
        </td>
        <td>
          {Converters.getDateTime(activity.startDateLocal)}
        </td>
        <td>
          {activity.name}
        </td>
        <td>
          {Converters.getMovingTime(activity.movingTime)}
        </td>
        <td>
          {Converters.metersToMiles(activity.distance).toFixed(1)} mi
        </td>
        <td>
          {Converters.metersToFeet(activity.totalElevationGain).toFixed(0)} ft
        </td>
        <td>
          {Converters.metersPerSecondToMilesPerHour(activity.averageSpeed).toFixed(1)} mph
        </td>
        <td>
          {calories}
        </td>
        <td>
          <button onClick={() => self.handleShowDetailedMap(activity.id)}>Show details</button>
        </td>
        <td>
          <button onClick={() => self.handleCreateSegments(activity.id)}>Create segments</button>
        </td>
      </tr>
    );
  }

  buildSummaryActivityRows() {

    var self = this;

    let activities = [];

    const activitiesLUT = this.props.activities.activitiesById;
    for (const key in activitiesLUT) {
      if (activitiesLUT.hasOwnProperty(key)) {
        activities.push(activitiesLUT[key]);
      }
    }

    // sort by start_date
    activities.sort( (a, b) => {

      const asd = a.startDateLocal.getTime();
      const bsd = b.startDateLocal.getTime();

      if (asd > bsd) {
        return -1;
      }
      if (asd < bsd) {
        return 1;
      }
      return 0;
    });

    let summaryActivityRows = activities.map(function(activity) {
      const summaryActivityRow = self.buildSummaryActivityRow(activity);
      return summaryActivityRow;
    });
    return summaryActivityRows;
  }

  render() {

    const summaryActivityRows = this.buildSummaryActivityRows();

    return (
      <div id="SummaryActivities">
        <Link to="/">Back</Link>
        <br/>
        <button type="button" id="btnMapSelectedRides" onClick={() => this.handleMapSelectedRides()}>
          Map selected rides
        </button>
        <table id="activitiesTable">
          <thead>
            <tr>
              <th/>
              <th>Date</th>
              <th>Name</th>
              <th>Riding Time</th>
              <th>Distance</th>
              <th>Elevation</th>
              <th>Average Speed</th>
              <th>Calories</th>
              <th/>
              <th/>
            </tr>
          </thead>
          <tbody>
            {summaryActivityRows}
          </tbody>
        </table>
      </div>
    );
  }
}

SummaryActivities.propTypes = {
  activities: React.PropTypes.object.isRequired,
  onShowDetailedMap: React.PropTypes.func.isRequired,
  onCreateSegments: React.PropTypes.func.isRequired,
  onMapStarredSegments: React.PropTypes.func.isRequired,
  onMapSelectedRides: React.PropTypes.func.isRequired
};

export default SummaryActivities;
