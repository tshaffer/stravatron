import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { loadDetailedActivity } from '../actions/index';

import * as Converters from '../utilities/converters';

import ActivityMap from './activityMap';
import ElevationChart from './elevationChart';

var moment = require('moment');

class DetailedActivity extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chartLocation: []
        };
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
        this.setState({ chartLocation: chartLocation });
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

        let mapPolyline = "";
        if (activity.map && activity.map.polyline) {
            mapPolyline = activity.map.polyline;
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
                <Link to="/" id="backFromDetailedActivityButton">Back</Link>
                <br/>
                {rideSummaryHeader}
                <ActivityMap
                    startLatitude={activity.startLatitude}
                    startLongitude={activity.startLongitude}
                    activitiesData={activitiesData}
                    location={this.state.chartLocation}
                    totalActivities={1}
                    mapHeight={"400px"}
                />
                <ElevationChart
                    streams={streams}
                    onLocationChanged = {this.handleChartLocationChange.bind(this)}
                />
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
