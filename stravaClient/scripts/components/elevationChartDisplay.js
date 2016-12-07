import React, { Component } from 'react';

import * as Converters from '../utilities/converters';

let segmentStartDistance = null;
let segmentEndDistance = null;

class ElevationChartDisplay extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
    this.chartDrawn = false;
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

  buildElevationGraph(stream) {

    var times;
    var distances;
    var elevations;
    var gradients;
    var locations;

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
      return;
    }

    let dataTable = new window.google.visualization.DataTable();
    dataTable.addColumn('number', 'Distance');
    dataTable.addColumn('number', 'ElevationPre');
    dataTable.addColumn('number', 'Elevation');
    dataTable.addColumn('number', 'ElevationPost');
    dataTable.addColumn({ type: 'string', role: 'tooltip', 'p': { 'html': true } });

    let row = [];
    let mapDistanceToLocation = {};
    let mapDistanceToStreamIndex = {};

    console.log("segmentEffortsForActivity length:", this.props.segmentEffortsForActivity.length);
    console.log("activityStartDateLocal: ", this.props.activityStartDateLocal);
    const activityStartTime = this.props.activityStartDateLocal.getTime();

    for (let i = 0; i < distances.length; i++) {

      let distance = distances[i];
      let elevation = elevations[i];
      let gradient = gradients[i];
      let location = locations[i];

      let distanceInMiles = Converters.metersToMiles(distance);
      let elevationInFeet = Converters.metersToFeet(elevation);

      row = [];
      row.push(distanceInMiles);
      row.push(elevationInFeet);
      row.push(elevationInFeet);
      row.push(elevationInFeet);

      let segmentEffortsAtTimeLabel = "";

      if (times) {
        // get segments from current time offset
        const timeOffset = activityStartTime + (times[i] * 1000);
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
      row.push(ttHtml);

      dataTable.addRow(row);

      const distanceIndex = Converters.metersToMiles(distance).toString();
      mapDistanceToLocation[distanceIndex] = Converters.stravatronCoordinateFromLatLng(location[0], location[1]);
      mapDistanceToStreamIndex[distanceIndex] = i;
    }

    let options = {
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

    let elevationChart = this.elevationChart;

    let chart;
    chart = new window.google.visualization.AreaChart(elevationChart);
    this.dataTable = dataTable;
    this.chart = chart;
    this.options = options;
    this.distances = distances;
    this.redrawChart();
    this.chartDrawn = true;
  }

  redrawChart() {
    const segmentCreationStartLocation = this.props.locationCoordinates.locationsByUIElement["segmentCreationStart"];
    const segmentCreationStartIndex = segmentCreationStartLocation.index;

    const segmentCreationEndLocation = this.props.locationCoordinates.locationsByUIElement["segmentCreationEnd"];
    const segmentCreationEndIndex = segmentCreationEndLocation.index;

    segmentStartDistance = Converters.metersToMiles(this.distances[segmentCreationStartIndex]);
    segmentEndDistance = Converters.metersToMiles(this.distances[segmentCreationEndIndex]);

    let dataView = new window.google.visualization.DataView(this.dataTable);

    dataView.setColumns([0, {calc: this.getPreRow, type: 'number'}, {calc: this.getRow, type: 'number'},
      {calc: this.getPostRow, type: 'number'}, 4]);
    this.chart.draw(dataView, this.options);
  }

  getPreRow(dataTable, rowNum) {
    let distance = dataTable.getValue(rowNum, 0);
    if (distance < segmentStartDistance) {
      let val = dataTable.getValue(rowNum, 1);
      return val;
    }
    else {
      return 0;
    }
  }

  getRow(dataTable, rowNum) {
    let distance = dataTable.getValue(rowNum, 0);
    if (distance >= segmentStartDistance && distance <= segmentEndDistance) {
      let val = dataTable.getValue(rowNum, 2);
      return val;
    }
    else {
      return 0;
    }
  }

  getPostRow(dataTable, rowNum) {
    let distance = dataTable.getValue(rowNum, 0);
    if (distance >= segmentEndDistance) {
      let val = dataTable.getValue(rowNum, 3);
      return val;
    }
    else {
      return 0;
    }
  }

  render() {

    let self = this;

    const segmentCreationStartLocation = this.props.locationCoordinates.locationsByUIElement["segmentCreationStart"];
    const segmentCreationEndLocation = this.props.locationCoordinates.locationsByUIElement["segmentCreationEnd"];
    if (!segmentCreationStartLocation || !segmentCreationEndLocation) {
      return (
        <noscript/>
      );
    }

    if (this.chartDrawn) {
      this.redrawChart();
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


ElevationChartDisplay.propTypes = {
  streams: React.PropTypes.array.isRequired,
  segmentEffortsForActivity: React.PropTypes.array.isRequired,
  activityStartDateLocal: React.PropTypes.object.isRequired,
  locationCoordinates: React.PropTypes.object.isRequired,
};


export default ElevationChartDisplay;