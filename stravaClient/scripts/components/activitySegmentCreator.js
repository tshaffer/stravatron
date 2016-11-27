import React, { Component } from 'react';
import { Link } from 'react-router';
import { hashHistory } from 'react-router';
var moment = require('moment');
const fs = require('fs');

import ActivityVisuals from './activityVisuals';
import SegmentCreator from './segmentCreator';

export default class ActivitySegmentCreator extends Component {

    componentWillMount() {
        this.props.onLoadDetailedActivity(this.props.params.id);
    }

    handleSetMapStreamIndex(streamIndex) {
        this.props.onSetMapStreamIndex(streamIndex);
    }

    handleSetMapLatitudeLongitude(mapLatitudeLongitude) {
        this.props.onSetMapLatitudeLongitude(mapLatitudeLongitude);
    }

    handleSetSegmentEndPoint(latitudeLongitude) {
        this.props.onSetSegmentEndPoint(latitudeLongitude);
    }

    render () {

        const activity = this.props.activity;

        if (!activity || this.props.segmentEffortsForActivity.length == 0) {
            return <div>Loading...</div>;
        }

        let mapPolyline = "";
        if (activity.mapPolyline) {
            mapPolyline = activity.mapPolyline;
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

        return (
            <div>
                <Link to="/allSummaryActivitiesContainer" id="backFromDetailedActivityButton">Back</Link>
                <br/>
                <SegmentCreator
                    activity={this.props.activity}
                    mapStreamIndex={this.props.mapStreamIndex}
                    onSetMapLatitudeLongitude = {this.handleSetMapLatitudeLongitude.bind(this)}
                    onSetSegmentEndPoint={this.handleSetSegmentEndPoint.bind(this)}
                    markerCount={2}
                    activityLocations={this.props.activityLocations}
                />
                <ActivityVisuals
                    activitiesData={activitiesData}
                    totalActivities={1}
                    mapHeight={"400px"}
                    markerCount={2}
                    mapLatitudeLongitude={this.props.mapLatitudeLongitude}
                    segmentEndPoint={this.props.segmentEndPoint}
                    streams={streams}
                    onSetMapLatitudeLongitude = {this.handleSetMapLatitudeLongitude.bind(this)}
                    onSetMapStreamIndex={this.handleSetMapStreamIndex.bind(this)}
                    activityStartDateLocal={activity.startDateLocal}
                    segmentEffortsForActivity={this.props.segmentEffortsForActivity}
                    activityLocations={this.props.activityLocations}
                />
            </div>
        );
    }
}

ActivitySegmentCreator.propTypes = {
    onLoadDetailedActivity: React.PropTypes.func.isRequired,
    onSetMapLatitudeLongitude: React.PropTypes.func.isRequired,
    onSetSegmentEndPoint: React.PropTypes.func.isRequired,
    onSetMapStreamIndex: React.PropTypes.func.isRequired,
    activity: React.PropTypes.object.isRequired,
    segmentEffortsForActivity: React.PropTypes.array.isRequired,
    params: React.PropTypes.object.isRequired,
    mapLatitudeLongitude: React.PropTypes.array.isRequired,
    segmentEndPoint: React.PropTypes.array.isRequired,
    mapStreamIndex: React.PropTypes.number.isRequired,
    activityLocations: React.PropTypes.array.isRequired
};
