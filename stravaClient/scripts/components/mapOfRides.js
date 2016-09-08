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

        activityIds.forEach( (activityId) => {
            this.props.loadDetailedActivity(activityId);
        });
    }

    render() {

        console.log("mapOfRides render invoked");

        const defaultJSX = (
            <div>
                <Link to="/" id="backFromDetailedActivityButton">Back</Link>
                <br/>
            </div>
        );

        if (!this.state.activityIds || this.state.activityIds.length === 0) {
            return defaultJSX;
        }

        const firstActivity = this.props.activities.activitiesById[this.state.activityIds[0]];

        let mapPolylines = [];

        this.state.activityIds.forEach( (activityId) => {
            const activity = this.props.activities.activitiesById[activityId];
            if (!activity.map || !activity.map.polyline || activity.map.polyline == "") {
                return defaultJSX;
            }
            mapPolylines.push(activity.map.polyline);
        });

        // let mapPolyline = "";
        // if (activity.map && activity.map.polyline) {
        //     mapPolyline = activity.map.polyline;
        // }

        return (
            <div>
                <Link to="/" id="backFromDetailedActivityButton">Back</Link>
                <br/>
                <ActivityMap
                    startLatitude={firstActivity.startLatitude}
                    startLongitude={firstActivity.startLongitude}
                    mapPolylines={mapPolylines}
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
