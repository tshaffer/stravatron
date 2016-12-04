import React, { Component } from 'react';

import ActivityMap from './activityMap';
import ElevationChart from './elevationChart';

export default class ActivityVisuals extends Component {

  render() {
    return (
      <div>
        <ActivityMap
          activitiesData={this.props.activitiesData}
          totalActivities={1}
          mapHeight={"400px"}
          markerCount={this.props.markerCount}
          activityLocations={this.props.activityLocations}
          locationCoordinates={this.props.locationCoordinates}
        />
        <ElevationChart
          activity={this.props.activity}
          streams={this.props.streams}
          activityStartDateLocal={this.props.activityStartDateLocal}
          segmentEffortsForActivity={this.props.segmentEffortsForActivity}
          onSetLocationCoordinates={this.props.onSetLocationCoordinates.bind(this)}
          locationCoordinates={this.props.locationCoordinates}
          markerCount={this.props.markerCount}
        />
      </div>
    );
  }
}

ActivityVisuals.propTypes = {
  activity: React.PropTypes.object.isRequired,
  activitiesData: React.PropTypes.array.isRequired,
  streams: React.PropTypes.array.isRequired,
  activityStartDateLocal: React.PropTypes.object.isRequired,
  segmentEffortsForActivity: React.PropTypes.array.isRequired,
  markerCount: React.PropTypes.number.isRequired,
  activityLocations: React.PropTypes.array.isRequired,

  onSetLocationCoordinates: React.PropTypes.func.isRequired,
  locationCoordinates: React.PropTypes.object.isRequired

};
