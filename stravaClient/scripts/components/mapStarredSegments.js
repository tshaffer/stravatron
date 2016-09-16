import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import ActivityMap from './activityMap';

class MapStarredSegments extends Component {

    render() {

        var self = this;

        const defaultJSX = (
            <div>
                <Link to="/">Back</Link>
                <br/>
            </div>
        );

        if (self.props.baseMapSegments.length > 0 && self.props.customMapSegments.length > 0) {

            let mapSegmentsData = [];

            self.props.baseMapSegments.forEach(baseMapSegment => {

                let defaultSegmentData =
                    {
                        textAnchor: "left",
                        textSize: 10,
                        textOffset: [0,0]
                    };

                defaultSegmentData.name = baseMapSegment.name;

                // look for entry in segmentsData that matches this baseMapSegment
                let customSegmentData = null;
                self.props.customMapSegments.forEach( (customMapSegmentData) => {
                    if (customMapSegmentData.id === baseMapSegment.id.toString()) {
                        customSegmentData = customMapSegmentData;
                        return;
                    }
                });

                let segmentData = {};
                if (customSegmentData) {
                    segmentData = customSegmentData;
                }
                else {
                    segmentData = defaultSegmentData;
                }

                let mapSegmentData =
                    {
                        segmentData,
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
                        startLatitude={self.props.baseMapSegments[0].startLatitude}
                        startLongitude={self.props.baseMapSegments[0].startLongitude}
                        activitiesData={mapSegmentsData}
                        location={[]}
                        totalActivities={self.props.baseMapSegments.length}
                        mapHeight={"760px"}
                    />
                </div>
            );
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
        baseMapSegments: state.baseMapSegments,
        customMapSegments: state.customMapSegments
    };
}


MapStarredSegments.propTypes = {
    baseMapSegments: React.PropTypes.array.isRequired,
    customMapSegments: React.PropTypes.array.isRequired
};


export default connect(mapStateToProps)(MapStarredSegments);

