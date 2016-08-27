import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { loadSummaryActivities, loadDetailedActivity } from '../actions/index';
import SummaryActivities from '../components/summaryActivities';

class SummaryActivitiesContainer extends Component {

    componentWillMount() {

        console.log("app.js::componentWillMount invoked");

        this.props.loadSummaryActivities();
    }

    render() {
        return (
            <div>
                <SummaryActivities
                    summaryActivities={this.props.summaryActivities}
                    loadDetailedActivity={this.props.loadDetailedActivity}
                />
            </div>
        );
    }
}

function mapStateToProps (state) {
    return {
        summaryActivities: state.summaryActivities
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({loadSummaryActivities, loadDetailedActivity},
        dispatch);
}

SummaryActivitiesContainer.propTypes = {
    loadSummaryActivities: React.PropTypes.func.isRequired,
    loadDetailedActivity: React.PropTypes.func.isRequired,
    summaryActivities: React.PropTypes.object.isRequired
};


export default connect(mapStateToProps, mapDispatchToProps)(SummaryActivitiesContainer);
