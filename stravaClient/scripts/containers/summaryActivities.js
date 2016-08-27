import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { loadSummaryActivities } from '../actions/index';

class SummaryActivities extends Component {

    componentWillMount() {

        console.log("app.js::componentWillMount invoked");

        this.props.loadSummaryActivities();
    }


    render() {
        return (
            <div>
                number of summary activities is: {Object.keys(this.props.summaryActivities.summaryActivitiesById).length}
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
    return bindActionCreators({loadSummaryActivities},
        dispatch);
}

SummaryActivities.propTypes = {
    loadSummaryActivities: React.PropTypes.func.isRequired,
    summaryActivities: React.PropTypes.object.isRequired
};


export default connect(mapStateToProps, mapDispatchToProps)(SummaryActivities);
