import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { loadDetailedActivity } from '../actions/index';

import * as Converters from '../utilities/converters';

var moment = require('moment');

class DetailedActivity extends Component {

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

        // 'best time' by sorting efforts by movingTime
        effortsForSegment.sort( (a, b) => {

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

        const analyzedEffortsForSegment =
            {
                bestEffortForSegment: effortsForSegment[0]
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

        let effortsForSegmentLbl = "none reported";
        if (this.props.effortsForSegments) {
            const effortsForSegment = this.props.effortsForSegments.effortsForSegmentsBySegmentId[segmentId];
            if (effortsForSegment) {
                if (effortsForSegment.length > 0) {

                    const effortData = this.analyzeEffortsForSegment(effortsForSegment);

                    const bestEffortTime = moment().startOf('day')
                        .seconds(Number(effortData.bestEffortForSegment.movingTime))
                        .format('mm:ss');

                    const bestEffortDate = moment(effortData.bestEffortForSegment.startDateLocal).format('YYYY-MM-DD');

                    effortsForSegmentLbl += " " + bestEffortDate;
                    effortsForSegmentLbl =
                        (
                        <span>
                            <span>{bestEffortTime}</span>
                            <span className="smallDimDate">{bestEffortDate}</span>
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
                    {effortsForSegmentLbl}
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

        console.log("segment effforts for activity", activity.name);


        const segmentEffortRows = this.buildSegmentEffortRows(activity.segmentEffortIds);

        return (

            <div id="DetailedActivity" className="detailsActivity">
                <table id="DetailedActivityTable" className="detailsActivityTable">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Time</th>
                            <th>Distance</th>
                            <th>Speed</th>
                            <th>Average Grade</th>
                            <th>Elevation Gain</th>
                            <th>Best Time</th>
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

        const activityId = this.props.params.id;
        console.log("activityId=", activityId);

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

        return (
            <div>
                <Link to="/" id="backFromDetailedActivityButton">Back</Link>
                <br/>
                {rideSummaryHeader}
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
