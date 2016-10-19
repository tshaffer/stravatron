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

        const activityIds = this.props.params.ids.split(",");

        this.setState({activityIds: activityIds});

        activityIds.forEach( (activityId) => {
            this.props.loadActivityMap(activityId);
        });
    }

    render() {

        const defaultJSX = (
            <div>
                <Link to="/">Back</Link>
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
            if (!activity.mapPolyline || activity.mapPolyline == "") {
                mapLoaded = false;
                return;
            }
            const activityData =
                {
                    polyline: activity.mapPolyline,
                    strokeColor: strokeColors[activityIndex % 4]
                };
            activitiesData.push(activityData);
            activityIndex++;
        });

        return (
            <div>
                <Link to="/summaryActivitiesContainer">Back</Link>
                <br/>
                <ActivityMap
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
    params: React.PropTypes.object.isRequired,
    loadActivityMap: React.PropTypes.func.isRequired,
    activities: React.PropTypes.object.isRequired
};


export default connect(mapStateToProps, mapDispatchToProps)(MapOfRides);
