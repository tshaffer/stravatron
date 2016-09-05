import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { loadDetailedActivity } from '../actions/index';

import * as Converters from '../utilities/converters';

var moment = require('moment');

let activityMap = null;
let activityPath = null;
let ridePathDecoded = null;
let google = null;
let startMarker = null;
let mapMarker = null;

class DetailedActivity extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chartLocation: null
        };
    }

    componentWillMount() {
        google = window.google;
    }

    componentDidMount() {

        console.log("detailedActivity.js::componentDidMount invoked");

        // create a DetailedActivityContainer and move this functionality to that object
        const activityId = this.props.params.id;
        this.props.loadDetailedActivity(activityId);
    }

    buildRideSummaryHeader(activity) {

        if (!activity) {
            return <div>pizza</div>;
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
                            <td>{activity.kilojoules.toFixed(0)}</td>
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

    buildSegmentEffortRow(segmentEffort) {

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
            const effortsForSegment = this.props.effortsForSegments.effortsForSegmentsBySegmentId[segmentId];
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
            </tr>
        );
    }

    buildSegmentEffortRows(segmentEffortIds) {

        const self = this;

        let segmentEffort = null;
        let segmentEfforts = [];

        segmentEffortIds.forEach( (segmentEffortId) => {

            segmentEffort = self.props.segmentEfforts.segmentEffortsById[segmentEffortId];

            if (segmentEffort) {
                segmentEfforts.push(segmentEffort);
                self.buildSegmentEffortRow(segmentEffort);
            }
        });

        let segmentEffortRows = segmentEfforts.map(function(segmentEffort) {
            const segmentEffortRow = self.buildSegmentEffortRow(segmentEffort);
            return segmentEffortRow;
        });
        return segmentEffortRows;
    }

    buildSegmentEffortsTable(activity) {

        const segmentEffortRows = this.buildSegmentEffortRows(activity.segmentEffortIds);

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
                        </tr>
                    </thead>
                    <tbody>
                    {segmentEffortRows}
                    </tbody>
                </table>
            </div>

        );
    }

    handleChartLocationChange(chartLocation) {
        // this.setState({ chartLocation: chartLocation });
    }

    buildElevationGraph(activity) {

        let stream = activity.streams;

        var distances;
        var elevations;
        var gradients;
        var locations;

        // at this point, stream is an array that includes a number of streams; need to pick out the required stream data
        for (let i = 0; i < stream.length; i++) {
            switch (stream[i].type) {
                case 'distance':
                    distances = stream[i].data;
                    break;
                case 'altitude':
                    elevations = stream[i].data;
                    break;
                case 'grade_smooth':
                    gradients = stream[i].data;
                    break;
                case 'latlng':
                    locations = stream[i].data;
                    break;
            }
        }

        if (distances == undefined || elevations == undefined || gradients == undefined || locations == undefined) {
            console.log("stream undefined");
            return;
        }

        var dataTable = new google.visualization.DataTable();
        dataTable.addColumn('number', 'Distance');
        dataTable.addColumn('number', 'Elevation');
        dataTable.addColumn({ type: 'string', role: 'tooltip', 'p': { 'html': true } });

        var row = [];
        var mapDistanceToLocation = {};

        for (let i = 0; i < distances.length; i++) {

            var distance = distances[i];
            var elevation = elevations[i];
            var gradient = gradients[i];
            var location = locations[i];

            var distanceInMiles = Converters.metersToMiles(distance);
            var elevationInFeet = Converters.metersToFeet(elevation);

            row = [];
            row.push(distanceInMiles);
            row.push(elevationInFeet);

            var ttHtml = '<div style="padding:5px 5px 5px 5px;">Distance:<b>' + distanceInMiles.toFixed(1) + 'mi</b><br>Elevation:<b>' + elevationInFeet.toFixed(0) + 'ft</b><br>Grade:<b>' + gradient.toFixed(1) + '%</b></div>';
            row.push(ttHtml);

            dataTable.addRow(row);

            mapDistanceToLocation[Converters.metersToMiles(distance).toString()] = location;
        }

        var options = {
            chartArea: { left: 60, top: 10, height: 160 },
            hAxis: {
                format: '## mi',
                textStyle: {
                    fontSize: 10
                }
            },
            vAxis: {
                format: '## ft',
                textStyle: {
                    fontSize: 10
                }
            },
            legend: {
                position: 'none'
            },
            tooltip: {
                isHtml: true
            },
            //curveType: 'function'
            width: 1800
        };

        let elevationChart = this.refs.elevationChart;
        var chart = new google.visualization.LineChart(elevationChart);

        chart.draw(dataTable, options);

        // draw marker at the beginning of the ride
        var startLocation = mapDistanceToLocation[dataTable.getValue(0, 0)];
        var startLatlng = new google.maps.LatLng(startLocation[0], startLocation[1]);
        var startMarkerOptions = {
            strokeColor: '#FFFFFF',
            strokeOpacity: 1,
            strokeWeight: 2,
            fillColor: '#00FF00',
            fillOpacity: 1,
            map: activityMap,
            center: startLatlng,
            radius: 50,
            editable: false,
            draggable: false
        };

        startMarker = new google.maps.Circle(startMarkerOptions);

        // Add our over/out handlers.
        google.visualization.events.addListener(chart, 'onmouseover', chartMouseOver);
        google.visualization.events.addListener(chart, 'onmouseout', chartMouseOut);

        function chartMouseOver(e) {
            console.log("chartMouseOver");
            chart.setSelection([e]);

            var item = chart.getSelection();
            if (item != undefined) {
                var selectedItem = item[0];
                //console.log("item selected:  row=" + selectedItem.row + ", column=" + selectedItem.column);
                //console.log("distance is: " + dataTable.getValue(selectedItem.row, 0));
                //console.log("elevation is: " + dataTable.getValue(selectedItem.row, selectedItem.column));

                var selectedLocation = mapDistanceToLocation[dataTable.getValue(selectedItem.row, 0)];
                if (selectedLocation != undefined) {
                    //console.log("selected location: ");
                    //console.log(selectedLocation);

                    //console.log("lat is: " + selectedLocation[0] + ", lng is: " + selectedLocation[1]);
                    var myLatlng = new google.maps.LatLng(selectedLocation[0], selectedLocation[1]);

                    // erase old marker, if it existed
                    if (mapMarker != null) {
                        mapMarker.setMap(null);
                    }

                    var markerOptions = {
                        strokeColor: '#FFFFFF',
                        strokeOpacity: 1,
                        strokeWeight: 2,
                        fillColor: '#0000FF',
                        fillOpacity: 1,
                        map: activityMap,
                        center: myLatlng,
                        radius: 50,
                        editable: false,
                        draggable: false
                    };

                    mapMarker = new google.maps.Circle(markerOptions);

                }
            }
        }

        function chartMouseOut(e) {
            chart.setSelection([{ 'row': null, 'column': null }]);
        }

    }

    initializeMap(activity, mapId) {

        var myLatlng = new google.maps.LatLng(activity.startLatitude, activity.startLongitude);
        var myOptions = {
            zoom: 14,
            center: myLatlng,
            //mapTypeId: google.maps.MapTypeId.TERRAIN
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        var createNewMap;
        if (!activityMap) {
            createNewMap = true;
        }
        else {
            createNewMap = false;
        }

        if (createNewMap) {
            // activityMap = new google.maps.Map(document.getElementById(mapId), myOptions);
            activityMap = new google.maps.Map(document.getElementById(mapId), myOptions);
        }
        else {
            activityMap.setZoom(14);
            activityMap.setCenter(myLatlng);
            if (activityPath != undefined) {
                activityPath.setMap(null);
            }
        }

        var pathToDecode = activity.map.polyline;
        ridePathDecoded = google.maps.geometry.encoding.decodePath(pathToDecode);

        var existingBounds = activityMap.getBounds();

        var bounds = new google.maps.LatLngBounds();
        ridePathDecoded.forEach( (location) => {
            bounds.extend(location);
        });

        if (createNewMap) {
            activityMap.fitBounds(bounds);
        }
        else {
            setTimeout(function () { activityMap.fitBounds(bounds); }, 1);
        }
        activityPath = new google.maps.Polyline({
            path: ridePathDecoded,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 2,
            map: activityMap
        });
    }


    render () {

        const activityId = this.props.params.id;

        const activitiesById = this.props.activities.activitiesById;

        let activity = null;
        if (activitiesById.hasOwnProperty(activityId)) {
            activity = activitiesById[activityId];
            if (!activity) {
                return (
                    <div>
                        <Link to="/" id="backFromDetailedActivityButton">Back</Link>
                        <br/>
                        Detailed activity for id {activityId} not found.
                    </div>
                );
            }
        }

        const rideSummaryHeader = this.buildRideSummaryHeader(activity);
        const segmentEffortsTable = this.buildSegmentEffortsTable(activity);

        // let mapPolyline = null;
        // if (activity.map && activity.map.polyline) {
        //     mapPolyline = activity.map.polyline;
        // }

        // {/*<SimpleMap*/}
    //         mapPolyline={mapPolyline}
    //         startLatitude={activity.startLatitude}
    //         startLongitude={activity.startLongitude}
    //         zoom={14}
    //         location={this.state.chartLocation}
    //     />
    //     <ElevationChart
    //     activity = {activity}
    //     onLocationChanged = { this.handleChartLocationChange.bind(this) }
    // />

        if (activity && this.refs.activityGMap && activity.map && activity.map.polyline) {
            // this.initializeMap(activity, this.refs.activityMap);
            this.initializeMap(activity, "activityGMap");
        }
        if (activity && this.refs.elevationChart && activity.streams) {
            this.buildElevationGraph(activity);
        }

        return (
            <div>
                <Link to="/" id="backFromDetailedActivityButton">Back</Link>
                <br/>
                {rideSummaryHeader}
                <div id="activityGMap" ref="activityGMap"/>
                <div id="elevationChart" ref="elevationChart"></div>
                {segmentEffortsTable}
            </div>
        );
    }
}

function mapStateToProps (state) {
    return {
        activities: state.activities,
        segments: state.segments,
        segmentEfforts: state.segmentEfforts,
        effortsForSegments: state.effortsForSegments
    };
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({loadDetailedActivity},
        dispatch);
}


DetailedActivity.propTypes = {
    activities: React.PropTypes.object.isRequired,
    params: React.PropTypes.object.isRequired,
    loadDetailedActivity: React.PropTypes.func.isRequired,
    segments: React.PropTypes.object.isRequired,
    segmentEfforts: React.PropTypes.object.isRequired,
    effortsForSegments: React.PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailedActivity);
