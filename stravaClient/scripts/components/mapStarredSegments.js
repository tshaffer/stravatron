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

        if (this.props.baseMapSegments.length > 0 && this.props.customMapSegments.length > 0) {

            let mapSegmentsData = [];

            this.props.baseMapSegments.forEach(baseMapSegment => {

                let label = baseMapSegment.name;

                // find entry in segmentsData that matches this baseMapSegment
                self.props.customMapSegments.forEach( (segmentData) => {
                    if (segmentData.id === baseMapSegment.id.toString()) {
                        console.log("found matching segment ", baseMapSegment.name);
                        console.log("modified name is: ", segmentData.name);
                        label = segmentData.name;
                    }
                });

                const mapSegmentData =
                    {
                        name: label,
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

