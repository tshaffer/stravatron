import React, { Component } from 'react';

const fs = require('fs');
const GeoJSON = require('geojson');

import * as Converters from '../utilities/converters';

export default class SegmentCreator extends Component {

    constructor(props) {
        super(props);

        this.startPointStreamIndex = -1;
        this.endPointStreamIndex = -1;

        this.geoJSONCoordinates = [];
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
        const fileName = "newSegments.geojson";
        console.log("save file ", fileName);
        fs.writeFile(fileName, geoJSONAsStr, (err) => {
            if (err) debugger;
            console.log(fileName, " write complete");
        });
    }

    handleSetStartPoint() {
        console.log("handleSetStartPoint");
        this.startPointStreamIndex = this.props.mapStreamIndex;
    }

    handleSetEndPoint() {
        console.log("handleSetEndPoint");
        this.endPointStreamIndex = this.props.mapStreamIndex;
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
            const existingGeoJSONSegments = JSON.parse(data);

            const segmentName = this.txtBoxSegmentName.value;
            const segmentCoordinates = segmentLocations;
            // this.writeGeoJSONSegment(segmentName, segmentCoordinates);
            this.addGeoJSONSegment(segmentName, segmentCoordinates);

            this.writeGeoJSONSegments(existingGeoJSONSegments);
        });
    }

    render() {
        const segmentNameStyle = {
            width: "128px"
        };

        return (
            <div>
                <button type="button" onClick={this.handleSetStartPoint.bind(this)}>Set Start Point</button>
                <button type="button" onClick={this.handleSetEndPoint.bind(this)}>Set End Point</button>
                Segment Name:
                <input type="text" id="txtBoxSegmentName" ref={(c) => {
                    this.txtBoxSegmentName = c;
                }}/>
                <button type="button" onClick={this.handleGenerateSegment.bind(this)}>Generate Segment</button>
            </div>
        );
    }
}

SegmentCreator.propTypes = {
    activity: React.PropTypes.object.isRequired,
    mapStreamIndex: React.PropTypes.number.isRequired
};
