import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { hashHistory } from 'react-router';

import { fetchAndUpdateSummaryActivities } from '../actions/index';
import { retrieveBaseMapSegments, retrieveCustomSegmentData } from '../actions/index';

import SummaryActivities from '../components/summaryActivities';

class SummaryActivitiesContainer extends Component {

    componentWillMount() {

        console.log("app.js::componentWillMount invoked");

        this.props.fetchAndUpdateSummaryActivities();
        this.props.retrieveBaseMapSegments();
        this.props.retrieveCustomSegmentData();
    }

    handleShowDetailedMap(activityId) {
        hashHistory.push('/detailedActivity/' + activityId);
    }

    handleMapStarredSegments() {
        hashHistory.push('/mapStarredSegments');
    }

    handleMapSelectedRides(selectedActivityIds) {
        hashHistory.push('/mapOfRides/' + selectedActivityIds);
    }

    render() {
        return (
            <div>
                <SummaryActivities
                    activities={this.props.activities}
                    onShowDetailedMap={this.handleShowDetailedMap.bind(this)}
                    onMapStarredSegments={this.handleMapStarredSegments.bind(this)}
                    onMapSelectedRides={this.handleMapSelectedRides.bind(this)}
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
    return bindActionCreators({fetchAndUpdateSummaryActivities, retrieveBaseMapSegments, retrieveCustomSegmentData},
        dispatch);
}

SummaryActivitiesContainer.propTypes = {
    fetchAndUpdateSummaryActivities: React.PropTypes.func.isRequired,
    retrieveBaseMapSegments: React.PropTypes.func.isRequired,
    retrieveCustomSegmentData: React.PropTypes.func.isRequired,
    activities: React.PropTypes.object.isRequired
};


export default connect(mapStateToProps, mapDispatchToProps)(SummaryActivitiesContainer);
