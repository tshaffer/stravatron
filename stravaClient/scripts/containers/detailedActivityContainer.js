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
            chartLocation: []
        };
    }

    componentWillMount() {

        if (Object.keys(this.props.activities.activitiesById).length == 0) {
            hashHistory.push('/');
            return;
        }

        const activityId = this.props.params.id;
        this.props.loadDetailedActivity(activityId);
    }

    render() {
        return (
            <div>
                <DetailedActivity
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

DetailedActivityContainer.propTypes = {
    activities: React.PropTypes.object.isRequired,
    params: React.PropTypes.object.isRequired,
    loadDetailedActivity: React.PropTypes.func.isRequired,
    segments: React.PropTypes.object.isRequired,
    segmentEfforts: React.PropTypes.object.isRequired,
    effortsForSegments: React.PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailedActivityContainer);
