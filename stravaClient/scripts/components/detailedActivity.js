import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { loadDetailedActivity } from '../actions/index';

import * as Converters from '../utilities/converters';

class DetailedActivity extends Component {

    componentDidMount() {

        console.log("detailedActivity.js::componentDidMount invoked");

        // create a DetailedActivityContainer and move this functionality to that object
        const activityId = this.props.params.id;
        this.props.loadDetailedActivity(activityId);
    }

    buildRideSummaryHeader(activity) {

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

        // Detailed activity for {activity.name}
        // <br/>
        // Number of segment efforts = {activity.segmentEffortIds.length}

        return (
            <div>
                <Link to="/" id="backFromDetailedActivityButton">Back</Link>
                <br/>
                {rideSummaryHeader}
            </div>
        );
    }
}

function mapStateToProps (state) {
    return {
        activities: state.activities
    };
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({loadDetailedActivity},
        dispatch);
}


DetailedActivity.propTypes = {
    activities: React.PropTypes.object.isRequired,
    params: React.PropTypes.object.isRequired,
    loadDetailedActivity: React.PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailedActivity);
