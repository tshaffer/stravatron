import React, { Component } from 'react';
import { Link } from 'react-router';
import { hashHistory } from 'react-router';
var moment = require('moment');
const fs = require('fs');
const GeoJSON = require('geojson');

import * as Converters from '../utilities/converters';

import ActivityMap from './activityMap';
import ElevationChart from './elevationChart';


export default class DetailedActivity extends Component {

    constructor(props) {
        super(props);

        this.startPoint = null;
        this.endPoint = null;
        this.startPointStreamIndex = -1;
        this.endPointStreamIndex = -1;

        this.geoJSONCoordinates = [];
    }

    componentWillMount() {
        this.props.onLoadDetailedActivity(this.props.params.id);
    }

    addGeoJSONSegment(segmentName, segmentCoordinates) {

        const segmentPointInterval = 10;
        const numCoordinates = segmentCoordinates.length;

        let coordinateIndex = 0;
        while (coordinateIndex < numCoordinates) {

            this.geoJSONCoordinates.push(
                {
                    title: segmentName + "-" + coordinateIndex.toString(),
                    x: segmentCoordinates[coordinateIndex][1],
                    y: segmentCoordinates[coordinateIndex][0]
                }
            );

            coordinateIndex += segmentPointInterval;
        }

        if (numCoordinates % segmentPointInterval != 0) {
            this.geoJSONCoordinates.push(
                {
                    title: segmentName + "-" + coordinateIndex.toString(),
                    x: segmentCoordinates[numCoordinates - 1][1],
                    y: segmentCoordinates[numCoordinates - 1][0]
                }
            );
        }

        this.geoJSONCoordinates.push(
            {
                title: segmentName,
                line: segmentCoordinates
            }
        );
    }

    writeGeoJSONSegment(segmentName, segmentCoordinates) {

        let segmentGeometry = [];

        // add point at start of segment
        const pointPropValue = "Start of " + segmentName;
        segmentGeometry[0] =
        {
            x: segmentCoordinates[0][1],
            y: segmentCoordinates[0][0],
            title: pointPropValue,
            location: pointPropValue
        };

        // line segments
        segmentGeometry[1] =
        {
            line: segmentCoordinates,
            title: segmentName,
            segment: segmentName
        };

        const geoJSON = GeoJSON.parse(segmentGeometry, {'Point': ['x', 'y'], 'LineString': 'line'});
        const geoJSONAsStr = JSON.stringify(geoJSON, null, '\t');
        const fileName = segmentName + ".geojson";
        console.log("save file ", fileName);
        fs.writeFile(fileName, geoJSONAsStr, (err) => {
            if (err) debugger;
            console.log(fileName, " write complete");
        });
    }

    writeGeoJSONSegments() {

        const geoJSON = GeoJSON.parse(this.geoJSONCoordinates, {'Point': ['x', 'y'], 'LineString': 'line'});
        const geoJSONAsStr = JSON.stringify(geoJSON, null, '\t');
        const fileName = "segments.geojson";
        console.log("save file ", fileName);
        fs.writeFile(fileName, geoJSONAsStr, (err) => {
            if (err) debugger;
            console.log(fileName, " write complete");
        });
    }

    handleSetMapStreamIndex(streamIndex) {
        this.props.onSetMapStreamIndex(streamIndex);
    }

    handleSetStartPoint() {
        console.log("handleSetStartPoint");
        this.startPoint = this.props.mapLatitudeLongitude;
        this.startPointStreamIndex = this.props.mapStreamIndex;
    }

    handleSetEndPoint() {
        console.log("handleSetEndPoint");
        this.endPoint = this.props.mapLatitudeLongitude;
        this.endPointStreamIndex = this.props.mapStreamIndex;
    }

    handleGenerateSegment() {
        console.log("handleGenerateSegment");
        console.log("generate segment: ");
        console.log(this.txtBoxSegmentName.value);
        console.log("start point:");
        console.log(this.startPoint);
        console.log(this.startPointStreamIndex);
        console.log("end point:");
        console.log(this.endPoint);
        console.log(this.endPointStreamIndex);

        const activity = this.props.activity;
        let streams = [];
        if (!activity.streams) {
            console.log("No streams available - return");
        }
        streams = activity.streams;

        let locations;
        for (let i = 0; i < streams.length; i++) {
            switch (streams[i].type) {
                case 'latlng':
                    locations = streams[i].data;
                    break;
            }
        }

        let segmentLocations = [];
        for (let i = this.startPointStreamIndex; i <= this.endPointStreamIndex; i++) {

            const stravaLocation = locations[i];
            const latitude = stravaLocation[0];
            const longitude = stravaLocation[1];
            const stravatronLocation = Converters.stravatronCoordinateFromLatLng(latitude, longitude);

            segmentLocations.push(stravatronLocation);
        }

        // add geo json segments for all existing segments
        let mapPolyline = "";
        if (!activity.mapPolyline) return;
        mapPolyline = activity.mapPolyline;

        const activityData =
            {
                polyline: mapPolyline,
                strokeColor: "red"
            };
        const activitiesData = [activityData];

        for (let segmentIndex = 0; segmentIndex < activitiesData.length; segmentIndex++) {
            const segmentData = activitiesData[segmentIndex];
            let pathToDecode = segmentData.polyline;
            let ridePathDecoded = window.google.maps.geometry.encoding.decodePath(pathToDecode);

            let coordinates = [];
            ridePathDecoded.forEach((location) => {
                let longitude = location.lng();
                let latitude = location.lat();
                let lngLat = [longitude, latitude];
                coordinates.push(lngLat);
            });
            let segmentName = segmentData.segmentData.name;
            console.log(segmentName, " is index ", segmentIndex);
            this.writeGeoJSONSegment(segmentName, coordinates);
            this.addGeoJSONSegment(segmentName, coordinates);
        }

        const segmentName = this.txtBoxSegmentName.value;
        const segmentCoordinates = segmentLocations;
        this.writeGeoJSONSegment(segmentName, segmentCoordinates);
        this.addGeoJSONSegment(segmentName, segmentCoordinates);

        this.writeGeoJSONSegments();
    }

    buildSegmenter() {

        const segmentNameStyle = {
            width: "128px"
        };

        return (
            <div>
                <button type="button" onClick={this.handleSetStartPoint.bind(this)}>Set Start Point</button>
                <button type="button" onClick={this.handleSetEndPoint.bind(this)}>Set End Point</button>
                Segment Name:
                <input type="text" id="txtBoxSegmentName" ref={(c) => {
                    this.txtBoxSegmentName = c;
                }}/>
                <button type="button" onClick={this.handleGenerateSegment.bind(this)}>Generate Segment</button>
            </div>
        );
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
                        const nextBestEffortDate = moment(effortData.effortsSortedByMovingTime[1].startDateLocal).format('YYYY-MM-DD');

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

        let segmentEffort = null;

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

    handleSetMapLatitudeLongitude(mapLatitudeLongitude) {
        this.props.onSetMapLatitudeLongitude(mapLatitudeLongitude);
    }

    render () {

        const activity = this.props.activity;

        if (!activity || this.props.segmentEffortsForActivity.length == 0) {
            return <div>Loading...</div>;
        }

        const rideSummaryHeader = this.buildRideSummaryHeader(activity);
        const segmenter = this.buildSegmenter();
        const segmentEffortsTable = this.buildSegmentEffortsTable();

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
                <Link to="/summaryActivitiesContainer" id="backFromDetailedActivityButton">Back</Link>
                <br/>
                {rideSummaryHeader}
                <ActivityMap
                    activitiesData={activitiesData}
                    totalActivities={1}
                    mapHeight={"400px"}
                    showMarker={true}
                    mapLatitudeLongitude={this.props.mapLatitudeLongitude}
                />
                <ElevationChart
                    streams={streams}
                    onSetMapLatitudeLongitude = {this.handleSetMapLatitudeLongitude.bind(this)}
                    onSetMapStreamIndex={this.handleSetMapStreamIndex.bind(this)}
                    activityStartDateLocal={activity.startDateLocal}
                    segmentEffortsForActivity={this.props.segmentEffortsForActivity}
                />
                {segmenter}
                {segmentEffortsTable}
            </div>
        );
    }
}

DetailedActivity.propTypes = {
    onLoadDetailedActivity: React.PropTypes.func.isRequired,
    onSetMapLatitudeLongitude: React.PropTypes.func.isRequired,
    onSetMapStreamIndex: React.PropTypes.func.isRequired,
    activity: React.PropTypes.object.isRequired,
    segments: React.PropTypes.object.isRequired,
    segmentEfforts: React.PropTypes.object.isRequired,
    effortsForSegments: React.PropTypes.object.isRequired,
    segmentEffortsForActivity: React.PropTypes.array.isRequired,
    params: React.PropTypes.object.isRequired,
    mapLatitudeLongitude: React.PropTypes.array.isRequired,
    mapStreamIndex: React.PropTypes.number.isRequired
    // fetchSegmentsActivities: React.PropTypes.func.isRequired
};
