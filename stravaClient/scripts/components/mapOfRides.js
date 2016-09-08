import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { loadDetailedActivity } from '../actions/index';

import ActivityMap from './activityMap';

class MapOfRides extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activityIds: []
        };
    }


    componentDidMount() {

        const activityIds = this.props.params.ids.split(",");

        this.setState({activityIds: activityIds});

        this.props.loadDetailedActivity(activityIds[0]);
    }

    render() {

        const defaultJSX = (
            <div>
                <Link to="/" id="backFromDetailedActivityButton">Back</Link>
                <br/>
            </div>
        );

        if (!this.state.activityIds || this.state.activityIds.length === 0) {
            return defaultJSX;
        }

        const activity = this.props.activities.activitiesById[this.state.activityIds[0]];

        let mapPolyline = "";
        if (activity.map && activity.map.polyline) {
            mapPolyline = activity.map.polyline;
        }

        return (
            <div>
                <Link to="/" id="backFromDetailedActivityButton">Back</Link>
                <br/>
                <ActivityMap
                    startLatitude={activity.startLatitude}
                    startLongitude={activity.startLongitude}
                    mapPolyline={mapPolyline}
                    location={[]}
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
    return bindActionCreators({loadDetailedActivity},
        dispatch);
}

MapOfRides.propTypes = {
    loadDetailedActivity: React.PropTypes.func.isRequired,
    activities: React.PropTypes.object.isRequired
};


export default connect(mapStateToProps, mapDispatchToProps)(MapOfRides);
