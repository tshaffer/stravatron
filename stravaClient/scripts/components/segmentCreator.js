import React, { Component } from 'react';

// require('rc-slider/assets/index.css');
const Slider = require('rc-slider');

const fs = require('fs');
const GeoJSON = require('geojson');

import * as Converters from '../utilities/converters';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default class SegmentCreator extends Component {

  constructor(props) {
    super(props);

    this.geoJSONCoordinates = [];

    this.clickStep = 1;
  }

  componentWillMount() {

    const initialStartIndex = Math.round(this.props.activityLocations.length / 3);
    const initialEndIndex = initialStartIndex * 2;

    const selectedStartLocation = this.props.activityLocations[initialStartIndex];
    const selectedEndLocation = this.props.activityLocations[initialEndIndex];

    this.props.onSetLocationCoordinates("segmentCreationStart", initialStartIndex, selectedStartLocation);
    this.props.onSetLocationCoordinates("segmentCreationEnd", initialEndIndex, selectedEndLocation);
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

    if (numCoordinates % segmentPointInterval !== 0) {
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

  handleSliderChange(sliderValues) {

    const selectedStartLocation = this.props.activityLocations[sliderValues[0]];
    this.props.onSetLocationCoordinates("segmentCreationStart", sliderValues[0], selectedStartLocation);

    const selectedEndLocation = this.props.activityLocations[sliderValues[1]];
    this.props.onSetLocationCoordinates("segmentCreationEnd", sliderValues[1], selectedEndLocation);
  }

  updateSlider(boundsIndex, step) {
    let bounds = this.sliderComponent.state.bounds;
    bounds[boundsIndex] += step;
    this.sliderComponent.setState({
      bounds
    });

    const location = this.props.activityLocations[bounds[boundsIndex]];
    if (boundsIndex === 0) {
      this.props.onSetLocationCoordinates("segmentCreationStart", bounds[boundsIndex], location);
    }
    else {
      this.props.onSetLocationCoordinates("segmentCreationEnd", bounds[boundsIndex], location);
    }
  }

  handleMoveStartForward() {
    this.updateSlider(0, this.clickStep);
  }

  handleMoveStartBack() {
    this.updateSlider(0, -this.clickStep);
  }

  handleMoveEndForward() {
    this.updateSlider(1, this.clickStep);
  }

  handleMoveEndBack() {
    this.updateSlider(1, -this.clickStep);
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

    const startPointStreamLocation = this.props.locationCoordinates.locationsByUIElement["segmentCreationStart"];
    const startPointStreamIndex = startPointStreamLocation.index;

    const endPointStreamLocation = this.props.locationCoordinates.locationsByUIElement["segmentCreationEnd"];
    const endPointStreamIndex = endPointStreamLocation.index;

    let segmentLocations = [];
    for (let i = startPointStreamIndex; i <= endPointStreamIndex; i++) {

      const stravaLocation = locations[i];
      const latitude = stravaLocation[0];
      const longitude = stravaLocation[1];
      const stravatronLocation = Converters.stravatronCoordinateFromLatLng(latitude, longitude);

      segmentLocations.push(stravatronLocation);
    }

    fs.readFile('segments.geojson', (_, data) => {

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


  render() {

    let self = this;

    if (!this.props.activityLocations || this.props.activityLocations.length === 0) {
      return (
        <noscript/>
      );
    }

    const startPointStreamLocation = this.props.locationCoordinates.locationsByUIElement["segmentCreationStart"];
    const endPointStreamLocation = this.props.locationCoordinates.locationsByUIElement["segmentCreationEnd"];
    if (!startPointStreamLocation || !endPointStreamLocation) {
      return (
        <noscript/>
      );
    }

    const style = { width: 600, margin: 10 };

    const buttonStyle = {
      margin: 0,
      backgroundColor: 'lightgray',
      fontSize: '12px'
    };

    // const segmentNameStyle = {
    //   width: "128px"
    // };

    const startPointStreamIndex = startPointStreamLocation.index;
    const endPointStreamIndex = endPointStreamLocation.index;

    return (

      <MuiThemeProvider>
        <div>
          <div style={style}>
            <Slider
              ref={(c) => {
                self.sliderComponent = c;
              }}
              min={0}
              max={self.props.activityLocations.length - 1}
              range={true}
              allowCross={false}
              defaultValue={[startPointStreamIndex, endPointStreamIndex]}
              tipFormatter={null}
              onChange={self.handleSliderChange.bind(self)} />

            <div className="floatRight">

              <button
                type="button"
                onClick={self.handleMoveEndBack.bind(self)}
                style={buttonStyle}
              >
                Back
              </button>

              <button
                type="button"
                onClick={self.handleMoveEndForward.bind(self)}
                style={buttonStyle}
              >
                Forward
              </button>

            </div>
            <div className="floatLeft">

              <button
                type="button"
                onClick={self.handleMoveStartBack.bind(self)}
                style={buttonStyle}
              >
                Back
              </button>

              <button
                type="button"
                onClick={self.handleMoveStartForward.bind(self)}
                style={buttonStyle}
              >
                Forward
              </button>

            </div>

          </div>
          <div className="clearBoth generateSegmentRow">
            <span className="segmentNameLabel">
              Segment Name:
            </span>
            <input type="text" id="txtBoxSegmentName" className="segmentNameText" ref={(c) => {
              self.txtBoxSegmentName = c;
            }}/>
            <button
              type="button"
              className="generateSegmentButton"
              onClick={self.handleGenerateSegment.bind(self)}
            >
              Generate Segment
            </button>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

SegmentCreator.propTypes = {
  activity: React.PropTypes.object.isRequired,
  activityLocations: React.PropTypes.array.isRequired,
  onSetLocationCoordinates: React.PropTypes.func.isRequired,
  locationCoordinates: React.PropTypes.object.isRequired
};
