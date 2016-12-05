import React, { Component } from 'react';

import * as Converters from '../utilities/converters';

let segmentStartDistance = null;
let segmentEndDistance = null;

class ElevationChart extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
    this.chartDrawn = false;
  }

  shouldComponentUpdate() {

    if (this.props.markerCount === 1 && this.chartDrawn) return false;

    return true;
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
    if (this.props.markerCount > 1) {
      dataTable.addColumn('number', 'ElevationPre');
    }
    dataTable.addColumn('number', 'Elevation');
    if (this.props.markerCount > 1) {
      dataTable.addColumn('number', 'ElevationPost');
    }
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

      if (this.props.markerCount === 2) {
        row.push(elevationInFeet);
        row.push(elevationInFeet);
      }

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
    if (this.props.markerCount === 1) {
      chart = new window.google.visualization.LineChart(elevationChart);
      chart.draw(dataTable, options);
    }
    else {
      chart = new window.google.visualization.AreaChart(elevationChart);
      this.dataTable = dataTable;
      this.chart = chart;
      this.options = options;
      this.distances = distances;
      this.redrawChart();
    }
    this.chartDrawn = true;

    // Add our over/out handlers.
    window.google.visualization.events.addListener(chart, 'onmouseover', chartMouseOver);
    window.google.visualization.events.addListener(chart, 'onmouseout', chartMouseOut);
    window.google.visualization.events.addListener(chart, 'onmousedown', chartMouseDown);
    window.google.visualization.events.addListener(chart, 'click', chartClick);

    let self = this;

    function chartClick(e) {
      console.log("chartClick");
      console.log(e.targetID);

      // e.targetID = "point#0#64" - point 64 in the chart data?
    }

    function chartMouseDown(e) {

      console.log("chartMouseDown");
      console.log(e.targetID);
    }

    function chartMouseOver(e) {

      chart.setSelection([e]);

      let item = chart.getSelection();
      if (item) {
        const selectedItem = item[0];

        const d = dataTable.getValue(selectedItem.row, 0);
        const selectedLocation = mapDistanceToLocation[d];
        const selectedStreamIndex = mapDistanceToStreamIndex[d];
        if (selectedLocation) {
          self.props.onSetLocationCoordinates("elevationChart", selectedStreamIndex, selectedLocation);
        }
      }
    }

    function chartMouseOut() {
      // chart.setSelection([{ 'row': null, 'column': null }]);
    }
  }

  redrawChart() {

    if (this.props.markerCount === 2) {

      let segmentCreationStartIndex;
      let segmentCreationEndIndex;

      const segmentCreationStartLocation = this.props.locationCoordinates.locationsByUIElement["segmentCreationStart"];
      if (segmentCreationStartLocation) {
        segmentCreationStartIndex = this.props.locationCoordinates.locationsByUIElement["segmentCreationStart"].index;
      }
      else {
        segmentCreationStartIndex = this.initialStartPointStreamIndex;
      }

      const segmentCreationEndLocation = this.props.locationCoordinates.locationsByUIElement["segmentCreationEnd"];
      if (segmentCreationEndLocation) {
        segmentCreationEndIndex = this.props.locationCoordinates.locationsByUIElement["segmentCreationEnd"].index;
      }
      else {
        segmentCreationEndIndex = this.initialEndPointStreamIndex;
      }

      segmentStartDistance = Converters.metersToMiles(this.distances[segmentCreationStartIndex]);
      segmentEndDistance = Converters.metersToMiles(this.distances[segmentCreationEndIndex]);

      let dataView = new window.google.visualization.DataView(this.dataTable);

      dataView.setColumns([0, {calc: this.getPreRow, type: 'number'}, {calc: this.getRow, type: 'number'},
        {calc: this.getPostRow, type: 'number'}, 4]);
      this.chart.draw(dataView, this.options);
    }
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

    this.initialStartPointStreamIndex = Math.round(this.props.activityLocations.length / 3);
    this.initialEndPointStreamIndex = this.initialStartPointStreamIndex * 2;

    if (this.chartDrawn && this.markerCount > 1) {
      this.redrawChart();
    }
    else if (this.elevationChart && this.props.streams.length > 0) {
      this.buildElevationGraph(this.props.streams);
    }

    return (
      <div id="elevationChart" ref={(c) => { this.elevationChart = c; }}/>
    );
  }
}



ElevationChart.propTypes = {
  activity: React.PropTypes.object.isRequired,
  streams: React.PropTypes.array.isRequired,
  segmentEffortsForActivity: React.PropTypes.array.isRequired,
  activityStartDateLocal: React.PropTypes.object.isRequired,

  onSetLocationCoordinates: React.PropTypes.func.isRequired,
  locationCoordinates: React.PropTypes.object.isRequired,
  markerCount: React.PropTypes.number.isRequired,
  activityLocations: React.PropTypes.array.isRequired,
};


export default ElevationChart;