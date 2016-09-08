import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { loadActivityMap } from '../actions/index';

import ActivityMap from './activityMap';

class MapOfRides extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activityIds: []
        };
    }


    componentWillMount() {

        console.log("mapOfRides componentWillMount invoked");

        const activityIds = this.props.params.ids.split(",");

        this.setState({activityIds: activityIds});

        activityIds.forEach( (activityId) => {
            this.props.loadActivityMap(activityId);
        });
    }

    render() {

        console.log("mapOfRides render invoked, number of activities is ", this.state.activityIds.length);

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

        let mapLoaded = true;

        const strokeColors = ["red", "blue", "purple", "green"];
        let activityIndex = 0;
        let activitiesData = [];

        this.state.activityIds.forEach( (activityId) => {
            const activity = this.props.activities.activitiesById[activityId];
            if (!activity.map || !activity.map.polyline || activity.map.polyline == "") {
                mapLoaded = false;
                return;
            }
            const activityData =
                {
                    polyline: activity.map.polyline,
                    strokeColor: strokeColors[activityIndex % 4]
                };
            activitiesData.push(activityData);
            activityIndex++;
        });
        console.log("number of activities sent to ActivityMap is ", activitiesData.length);

        return (
            <div>
                <Link to="/" id="backFromDetailedActivityButton">Back</Link>
                <br/>
                <ActivityMap
                    startLatitude={firstActivity.startLatitude}
                    startLongitude={firstActivity.startLongitude}
                    activitiesData={activitiesData}
                    location={[]}
                    totalActivities={this.state.activityIds.length}
                    mapHeight={"760px"}
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
    return bindActionCreators({loadActivityMap},
        dispatch);
}

MapOfRides.propTypes = {
    params: React.PropTypes.string.isRequired,
    loadActivityMap: React.PropTypes.func.isRequired,
    activities: React.PropTypes.object.isRequired
};


export default connect(mapStateToProps, mapDispatchToProps)(MapOfRides);
