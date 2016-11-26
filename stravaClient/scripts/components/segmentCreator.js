import React, { Component } from 'react';

// require('rc-slider/assets/index.css');
const Slider = require('rc-slider');

const fs = require('fs');
const GeoJSON = require('geojson');

import * as Converters from '../utilities/converters';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';

export default class SegmentCreator extends Component {

    constructor(props) {
        super(props);

        this.startPointStreamIndex = -1;
        this.endPointStreamIndex = -1;

        this.geoJSONCoordinates = [];

        this.clickStep = 1;
    }

    addGeoJSONSegment(segmentName, segmentCoordinates) {

        const segmentPointInterval = 10;
        const numCoordinates = segmentCoordinates.length;

        let coordinateIndex = 0;
        while (coordinateIndex < numCoordinates) {

            this.geoJSONCoordinates.push(
                {
                    title: segmentName + "-" + coordinateIndex.toString(),
                    x: segmentCoordinates[coordinateIndex][1],
                    y: segmentCoordinates[coordinateIndex][0]
                }
            );

            coordinateIndex += segmentPointInterval;
        }

        if (numCoordinates % segmentPointInterval != 0) {
            this.geoJSONCoordinates.push(
                {
                    title: segmentName + "-" + coordinateIndex.toString(),
                    x: segmentCoordinates[numCoordinates - 1][1],
                    y: segmentCoordinates[numCoordinates - 1][0]
                }
            );
        }

        this.geoJSONCoordinates.push(
            {
                title: segmentName,
                line: segmentCoordinates
            }
        );
    }

    writeGeoJSONSegment(segmentName, segmentCoordinates) {

        let segmentGeometry = [];

        // add point at start of segment
        const pointPropValue = "Start of " + segmentName;
        segmentGeometry[0] =
        {
            x: segmentCoordinates[0][1],
            y: segmentCoordinates[0][0],
            title: pointPropValue,
            location: pointPropValue
        };

        // line segments
        segmentGeometry[1] =
        {
            line: segmentCoordinates,
            title: segmentName,
            segment: segmentName
        };

        const geoJSON = GeoJSON.parse(segmentGeometry, {'Point': ['x', 'y'], 'LineString': 'line'});
        const geoJSONAsStr = JSON.stringify(geoJSON, null, '\t');
        const fileName = segmentName + ".geojson";
        console.log("save file ", fileName);
        fs.writeFile(fileName, geoJSONAsStr, (err) => {
            if (err) debugger;
            console.log(fileName, " write complete");
        });
    }

    writeGeoJSONSegments(existingGeoJSONSegments) {

        const geoJSON = GeoJSON.parse(this.geoJSONCoordinates, {'Point': ['x', 'y'], 'LineString': 'line'});

        let allGeoJSONSegmentFeatures = existingGeoJSONSegments.features.concat(geoJSON.features);
        existingGeoJSONSegments.features = allGeoJSONSegmentFeatures;

        const geoJSONAsStr = JSON.stringify(existingGeoJSONSegments, null, '\t');
        const fileName = "segments.geojson";
        console.log("save file ", fileName);
        fs.writeFile(fileName, geoJSONAsStr, (err) => {
            if (err) debugger;
            console.log(fileName, " write complete");
        });
    }

    updateSlider(boundsIndex, step) {
        let bounds = this.sliderComponent.state.bounds;
        bounds[boundsIndex] += step;
        this.sliderComponent.setState({
            bounds
        });
    }

    handleSetStartPoint() {
        this.startPointStreamIndex = this.props.mapStreamIndex;
    }

    handleSetEndPoint() {
        this.endPointStreamIndex = this.props.mapStreamIndex;
    }

    handleMoveStartForward() {
        console.log("poo1");
        this.updateSlider(0, this.clickStep);
    }

    handleMoveStartBack() {
        console.log("poo2");
        this.updateSlider(0, -this.clickStep);
    }

    handleMoveEndForward() {
        console.log("poo3");
        this.updateSlider(1, this.clickStep);
    }

    handleMoveEndBack() {
        console.log("poo4");
        this.updateSlider(1, -this.clickStep);
    }

    getActivityLocations() {

        const activity = this.props.activity;
        let streams = [];
        if (!activity.streams) {
            console.log("No streams available - return");
            return null;
        }
        streams = activity.streams;

        let locations;
        for (let i = 0; i < streams.length; i++) {
            switch (streams[i].type) {
                case 'latlng':
                    locations = streams[i].data;
                    break;
            }
        }

        let activityLocations = [];
        for (let i = 0; i < locations.length; i++) {

            const stravaLocation = locations[i];
            const latitude = stravaLocation[0];
            const longitude = stravaLocation[1];
            const stravatronLocation = Converters.stravatronCoordinateFromLatLng(latitude, longitude);

            activityLocations.push(stravatronLocation);
        }

        return activityLocations;
    }


    handleGenerateSegment() {

        const activity = this.props.activity;
        let streams = [];
        if (!activity.streams) {
            console.log("No streams available - return");
        }
        streams = activity.streams;

        let locations;
        for (let i = 0; i < streams.length; i++) {
            switch (streams[i].type) {
                case 'latlng':
                    locations = streams[i].data;
                    break;
            }
        }

        let segmentLocations = [];
        for (let i = this.startPointStreamIndex; i <= this.endPointStreamIndex; i++) {

            const stravaLocation = locations[i];
            const latitude = stravaLocation[0];
            const longitude = stravaLocation[1];
            const stravatronLocation = Converters.stravatronCoordinateFromLatLng(latitude, longitude);

            segmentLocations.push(stravatronLocation);
        }

        fs.readFile('segments.geojson', (err, data) => {

            // load existing map segments from segments.geojson
            const existingGeoJSONSegments = JSON.parse(data);

            // add in data from new segment - the stream values between the start index and the end index
            const segmentName = this.txtBoxSegmentName.value;
            const segmentCoordinates = segmentLocations;
            // this.writeGeoJSONSegment(segmentName, segmentCoordinates);
            this.addGeoJSONSegment(segmentName, segmentCoordinates);

            this.writeGeoJSONSegments(existingGeoJSONSegments);
        });
    }


    handleSliderChange(sliderValues) {
        console.log(sliderValues);
        // this.setState(
        //     {
        //         start: sliderValues[0],
        //         end: sliderValues[1]
        //     }
        // );
    }

    render() {

        let self = this;

        this.activityLocations = this.getActivityLocations();
        if (!this.activityLocations) {
            return (
                <noscript/>
            );
        }

        const style = { width: 400, margin: 50 };

        const buttonStyle = {
            margin: 0,
            backgroundColor: 'lightgray'
        };

        const segmentNameStyle = {
            width: "128px"
        };

        return (

            <MuiThemeProvider>
                <div>
                    <div>
                        <div style={style}>
                            <Slider
                                ref={(c) => {
                                    self.sliderComponent = c;
                                }}
                                min={0}
                                max={self.activityLocations.length - 1}
                                range={true}
                                allowCross={false}
                                defaultValue={[0, self.activityLocations.length - 1]}
                                tipFormatter={null}
                                onChange={self.handleSliderChange.bind(self)} />
                        </div>
                    </div>

                    <div className="floatRight">
                        <FlatButton
                            onClick={self.handleMoveEndBack.bind(self)}
                            label="Back"
                            style={buttonStyle}
                        />
                        <FlatButton
                            onClick={self.handleMoveEndForward.bind(self)}
                            label="Forward"
                            style={buttonStyle}
                        />
                    </div>
                    <div className="floatLeft">
                        <FlatButton
                            onClick={self.handleMoveStartBack.bind(self)}
                            label="Back"
                            style={buttonStyle}
                        />
                        <FlatButton
                            onClick={self.handleMoveStartForward.bind(self)}
                            label="Forward"
                            style={buttonStyle}
                        />
                    </div>

                    <div className="clearBoth">
                        Segment Name:
                        <input type="text" id="txtBoxSegmentName" ref={(c) => {
                            self.txtBoxSegmentName = c;
                        }}/>
                        <button type="button" onClick={self.handleGenerateSegment.bind(self)}>Generate Segment</button>
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

SegmentCreator.propTypes = {
    activity: React.PropTypes.object.isRequired,
    mapStreamIndex: React.PropTypes.number.isRequired
};
