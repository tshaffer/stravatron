import React, { Component } from 'react';

import * as Converters from '../utilities/converters';

class ElevationChart extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
    this.chartDrawn = false;

    this.options = {
      chartArea: { left: 60, top: 10, height: 160 },
      hAxis: {
        format: '## mi',
        textStyle: {
          fontSize: 10
        }
      },
      vAxis: {
        format: '## ft',
        textStyle: {
          fontSize: 10
        }
      },
      legend: {
        position: 'none'
      },
      tooltip: {
        isHtml: true
      },
      // width: 1800
      // width of 1500 looks best on laptop
      width: 1500,
      colors: ['#000000', "green", '#000000'],
      isStacked: false
    };
  }

  getSegmentsFromTime(timeOffset) {

    let segmentEffortsAtTime = [];

    this.props.segmentEffortsForActivity.forEach( (segmentEffort) => {

      let dt;
      if (typeof segmentEffort.startDateLocal === 'string') {
        dt = new Date(segmentEffort.startDateLocal);
      }
      else {
        dt = segmentEffort.startDateLocal;
      }

      let segmentStartTime;
      try {
        segmentStartTime = dt.getTime();
      }
      catch(err) {
        console.log(err);
      }

      const segmentEndTime = segmentStartTime + (segmentEffort.movingTime * 1000);

      if (timeOffset >= segmentStartTime && timeOffset < segmentEndTime) {
        segmentEffortsAtTime.push(segmentEffort);
      }
    });

    return segmentEffortsAtTime;
  }

  getStreamData(stream) {

    this.activityStartTime = this.props.activityStartDateLocal.getTime();

    let times;
    let distances;
    let elevations;
    let gradients;
    let locations;

    // at this point, stream is an array that includes a number of streams; need to pick out the required stream data
    for (let i = 0; i < stream.length; i++) {
      switch (stream[i].type) {
        case 'time':
          times = stream[i].data;
          break;
        case 'distance':
          distances = stream[i].data;
          break;
        case 'altitude':
          elevations = stream[i].data;
          break;
        case 'grade_smooth':
          gradients = stream[i].data;
          break;
        case 'latlng':
          locations = stream[i].data;
          break;
      }
    }

    if (!distances || !elevations || !gradients || !locations) {
      console.log("stream undefined");
      return null;
    }
    
    return {
      times,
      distances,
      elevations,
      gradients,
      locations
    };
  }
  
  // rename me once I figure out what it should be named
  getRowData(i, streams) {

    const { times, distances, elevations, gradients, locations } = streams;

    let distance = distances[i];
    let elevation = elevations[i];
    let gradient = gradients[i];
    let location = locations[i];

    let distanceInMiles = Converters.metersToMiles(distance);
    let elevationInFeet = Converters.metersToFeet(elevation);

    let segmentEffortsAtTimeLabel = "";

    if (times) {
      // get segments from current time offset
      const timeOffset = this.activityStartTime + (times[i] * 1000);
      const segmentEffortsAtTime = this.getSegmentsFromTime(timeOffset);

      if (segmentEffortsAtTime.length > 0) {
        if (segmentEffortsAtTime.length === 1) {
          segmentEffortsAtTimeLabel = "<br>Segment: <b>";
        }
        else {
          segmentEffortsAtTimeLabel = "<br>Segments: <b>";
        }

        segmentEffortsAtTime.forEach( (segmentEffortAtTime, index) => {
          if (index > 0) {
            segmentEffortsAtTimeLabel += ", ";
          }
          segmentEffortsAtTimeLabel += segmentEffortAtTime.name;
        });
        segmentEffortsAtTimeLabel += "</b>";
      }
    }

    let ttHtml = '<div style="padding:5px 5px 5px 5px;">Distance:<b>' + distanceInMiles.toFixed(1);
    ttHtml += 'mi</b><br>Elevation:<b>' + elevationInFeet.toFixed(0)
      + 'ft</b><br>Grade:<b>' + gradient.toFixed(1) + '%</b>';
    ttHtml += segmentEffortsAtTimeLabel + '</div>';
    
    return {
      distance,
      location,
      distanceInMiles,
      elevationInFeet,
      ttHtml
    };
  }
  render() {

    let self = this;

    let retVal = this.preRender();
    if (retVal) {
      return retVal;
    }

    return (
      <div
        id="elevationChart"
        ref={(c) => {
          self.elevationChart = c;
          if (!self.chartDrawn) {
            self.buildElevationGraph(self.props.streams);
          }
        }}
      />
    );
  }
}

ElevationChart.propTypes = {
  streams: React.PropTypes.array.isRequired,
  segmentEffortsForActivity: React.PropTypes.array.isRequired,
  activityStartDateLocal: React.PropTypes.object.isRequired,
  onSetLocationCoordinates: React.PropTypes.func,
  activityLocations: React.PropTypes.array.isRequired,
};

export default ElevationChart;