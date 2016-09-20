import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { hashHistory } from 'react-router';

import { loadSummaryActivities, loadDetailedActivity } from '../actions/index';
import { retrieveBaseMapSegments, retrieveCustomSegmentData } from '../actions/index';

import SummaryActivities from '../components/summaryActivities';

class SummaryActivitiesContainer extends Component {

    componentWillMount() {

        console.log("app.js::componentWillMount invoked");

        this.props.loadSummaryActivities();
        this.props.retrieveBaseMapSegments();
        this.props.retrieveCustomSegmentData();
    }

    handleShowDetailedMap(activityId) {
        hashHistory.push('/detailedActivity/' + activityId);
    }

    render() {
        return (
            <div>
                <SummaryActivities
                    activities={this.props.activities}
                    loadDetailedActivity={this.props.loadDetailedActivity}
                    onShowDetailedMap={this.handleShowDetailedMap.bind(this)}
                />
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
    return bindActionCreators({loadSummaryActivities, loadDetailedActivity, retrieveBaseMapSegments, retrieveCustomSegmentData},
        dispatch);
}

SummaryActivitiesContainer.propTypes = {
    loadSummaryActivities: React.PropTypes.func.isRequired,
    loadDetailedActivity: React.PropTypes.func.isRequired,
    retrieveBaseMapSegments: React.PropTypes.func.isRequired,
    retrieveCustomSegmentData: React.PropTypes.func.isRequired,
    activities: React.PropTypes.object.isRequired
};


export default connect(mapStateToProps, mapDispatchToProps)(SummaryActivitiesContainer);
