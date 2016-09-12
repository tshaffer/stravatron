import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { retrieveBaseMapSegments } from '../actions/index';

import ActivityMap from './activityMap';

const fs = require('fs');
const path = require('path');

class MapStarredSegments extends Component {

    componentWillMount() {

        console.log("mapStarredSegments componentWillMount invoked");

        this.props.retrieveBaseMapSegments();
    }

    render() {
        const defaultJSX = (
            <div>
                <Link to="/">Back</Link>
                <br/>
            </div>
        );

        if (this.props.baseMapSegments.length > 0) {

            fs.readFile('segments.json', (err, data) => {
                debugger;
                const segmentsData = JSON.parse(data);
                // if (err) throw err;
                // console.log(data);

                let mapSegmentsData = [];

                this.props.baseMapSegments.forEach(baseMapSegment => {

                    // find entry in segmentsData that matches this baseMapSegment
                    segmentsData.segments.forEach( (segmentData) => {
                        if (segmentData.id === baseMapSegment.id.toString()) {
                            console.log("found matching segment ", baseMapSegment.name);
                            console.log("modified name is: ", segmentData.name);
                        }
                    });

                    const mapSegmentData =
                        {
                            name: baseMapSegment.name,
                            polyline: baseMapSegment.polyline,
                            strokeColor: 'black'
                        };
                    mapSegmentsData.push(mapSegmentData);

                });

                return (
                    <div>
                        <Link to="/">Back</Link>
                        <br/>
                        <ActivityMap
                            startLatitude={this.props.baseMapSegments[0].startLatitude}
                            startLongitude={this.props.baseMapSegments[0].startLongitude}
                            activitiesData={mapSegmentsData}
                            location={[]}
                            totalActivities={this.props.baseMapSegments.length}
                            mapHeight={"760px"}
                        />
                    </div>
                );
            });
        }

        return (
            <div>
                <Link to="/">Back</Link>
                <br/>
                <ActivityMap
                    startLatitude={69}
                    startLongitude={69}
                    activitiesData={[]}
                    location={[]}
                    totalActivities={69}
                    mapHeight={"760px"}
                />
            </div>
        );

    }
}

function mapStateToProps (state) {
    return {
        baseMapSegments: state.baseMapSegments
    };
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({retrieveBaseMapSegments},
        dispatch);
}

MapStarredSegments.propTypes = {
    baseMapSegments: React.PropTypes.array.isRequired,
    retrieveBaseMapSegments: React.PropTypes.func.isRequired
};


export default connect(mapStateToProps, mapDispatchToProps)(MapStarredSegments);

