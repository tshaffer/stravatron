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
                    markerCount={1}
                    mapLatitudeLongitude={this.props.mapLatitudeLongitude}
                />
                <ElevationChart
                    streams={this.props.streams}
                    onSetMapLatitudeLongitude = {this.props.onSetMapLatitudeLongitude}
                    onSetMapStreamIndex={this.props.onSetMapStreamIndex}
                    activityStartDateLocal={this.props.activityStartDateLocal}
                    segmentEffortsForActivity={this.props.segmentEffortsForActivity}
                />
            </div>
        );
    }
}

ActivityVisuals.propTypes = {
    activitiesData: React.PropTypes.array.isRequired,
    mapLatitudeLongitude: React.PropTypes.array.isRequired,
    streams: React.PropTypes.array.isRequired,
    activityStartDateLocal: React.PropTypes.object.isRequired,
    segmentEffortsForActivity: React.PropTypes.array.isRequired,
    onSetMapLatitudeLongitude: React.PropTypes.func.isRequired,
    onSetMapStreamIndex: React.PropTypes.func.isRequired,
};
