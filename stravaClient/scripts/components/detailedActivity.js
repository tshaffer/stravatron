import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { loadDetailedActivity } from '../actions/index';

class DetailedActivity extends Component {

    componentDidMount() {

        console.log("detailedActivity.js::componentDidMount invoked");

        // create a DetailedActivityContainer and move this functionality to that object
        const activityId = this.props.params.id;
        this.props.loadDetailedActivity(activityId);
    }

    render () {

        const detailedActivityId = this.props.params.id;
        console.log("detailedActivityId=", detailedActivityId);

        const activitiesById = this.props.activities.activitiesById;

        let detailedActivity = null;
        if (activitiesById.hasOwnProperty(detailedActivityId)) {
            detailedActivity = activitiesById[detailedActivityId];
        }

        if (detailedActivity) {
            return (
                <div>
                    <Link to="/" id="backFromDetailedActivityButton">Back</Link>
                    <br/>
                    Detailed activity for {detailedActivity.name}
                    <br/>
                    Number of segment efforts = {detailedActivity.segmentEffortIds.length}
                </div>
            );
        }
        else {
            return (
                <div>Detailed activity for id {detailedActivityId} not found.</div>
            );
        }
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
