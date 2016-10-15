import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { hashHistory } from 'react-router';

import { loadDetailedActivity } from '../actions/index';

import DetailedActivity from '../components/detailedActivity';

class DetailedActivityContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            chartLocation: [],
            activityId: ""
        };
    }

    componentWillMount() {

        if (Object.keys(this.props.activities.activitiesById).length == 0) {
            hashHistory.push('/');
            return;
        }

        const activityId = this.props.params.id;
        this.setState({activityId: activityId});

        this.props.loadDetailedActivity(activityId);
    }

    render() {
        return (
            <div>
                <DetailedActivity
                    activityId={this.state.activityId}
                    activities={this.props.activities}
                />
            </div>
        );
    }
}

function mapStateToProps (state) {
    return {
        activities: state.activities,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({loadDetailedActivity},
        dispatch);
}

DetailedActivityContainer.propTypes = {
    activities: React.PropTypes.object.isRequired,
    params: React.PropTypes.object.isRequired,
    loadDetailedActivity: React.PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailedActivityContainer);
