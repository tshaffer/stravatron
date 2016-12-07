import React, { Component } from 'react';
import { Link } from 'react-router';

import ActivityMap from './activityMap';
import ElevationChartDisplay from './elevationChartDisplay';

import SegmentCreator from './segmentCreator';

export default class ActivitySegmentCreator extends Component {

  componentWillMount() {
    this.props.onLoadDetailedActivity(this.props.params.id);
  }

  render () {

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

    return (
      <div>
        <Link to="/allSummaryActivitiesContainer" id="backFromDetailedActivityButton">Back</Link>
        <br/>
        <SegmentCreator
          activity={this.props.activity}
          markerCount={2}
          activityLocations={this.props.activityLocations}
          locationCoordinates={this.props.locationCoordinates}
          onSetLocationCoordinates={this.props.onSetLocationCoordinates.bind(this)}
        />
        <ActivityMap
          activitiesData={activitiesData}
          totalActivities={1}
          mapHeight={"400px"}
          markerCount={2}
          activityLocations={this.props.activityLocations}
          locationCoordinates={this.props.locationCoordinates}
        />
        <ElevationChartDisplay
          streams={streams}
          activityStartDateLocal={activity.startDateLocal}
          segmentEffortsForActivity={this.props.segmentEffortsForActivity}
          locationCoordinates={this.props.locationCoordinates}
        />

      </div>
    );
  }
}

ActivitySegmentCreator.propTypes = {
  onLoadDetailedActivity: React.PropTypes.func.isRequired,
  activity: React.PropTypes.object.isRequired,
  segmentEffortsForActivity: React.PropTypes.array.isRequired,
  params: React.PropTypes.object.isRequired,
  activityLocations: React.PropTypes.array.isRequired,
  onSetLocationCoordinates: React.PropTypes.func.isRequired,
  locationCoordinates: React.PropTypes.object.isRequired
};
