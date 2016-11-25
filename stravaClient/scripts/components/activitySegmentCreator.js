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
                <ActivityVisuals
                    activitiesData={activitiesData}
                    totalActivities={1}
                    mapHeight={"400px"}
                    showMarker={true}
                    mapLatitudeLongitude={this.props.mapLatitudeLongitude}
                    streams={streams}
                    onSetMapLatitudeLongitude = {this.handleSetMapLatitudeLongitude.bind(this)}
                    onSetMapStreamIndex={this.handleSetMapStreamIndex.bind(this)}
                    activityStartDateLocal={activity.startDateLocal}
                    segmentEffortsForActivity={this.props.segmentEffortsForActivity}
                />
                <SegmentCreator
                    activity={this.props.activity}
                    mapStreamIndex={this.props.mapStreamIndex}
                />
            </div>
        );
    }
}

ActivitySegmentCreator.propTypes = {
    onLoadDetailedActivity: React.PropTypes.func.isRequired,
    onSetMapLatitudeLongitude: React.PropTypes.func.isRequired,
    onSetMapStreamIndex: React.PropTypes.func.isRequired,
    activity: React.PropTypes.object.isRequired,
    segmentEffortsForActivity: React.PropTypes.array.isRequired,
    params: React.PropTypes.object.isRequired,
    mapLatitudeLongitude: React.PropTypes.array.isRequired,
    mapStreamIndex: React.PropTypes.number.isRequired
};
