import React, { Component } from 'react';

import * as Converters from '../utilities/converters';

class ElevationChart extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
    this.chartDrawn = false;
  }

  shouldComponentUpdate() {

    if (this.chartDrawn) return false;

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


    // distances.length = 1278

    for (let i = 0; i < distances.length; i++) {

      let distance = distances[i];
      let elevation = elevations[i];
      let gradient = gradients[i];
      let location = locations[i];

      let distanceInMiles = Converters.metersToMiles(distance);

      let elevationInUse, elevationInFeetPre, elevationInFeet, elevationInFeetPost;
      if (i < (distances.length / 3)) {
        elevationInFeetPre = Converters.metersToFeet(elevation);
        elevationInFeet = 0;
        elevationInFeetPost = 0;

        elevationInUse = elevationInFeetPre;
      }
      else if (i < (distances.length * 2 / 3)) {
        elevationInFeet = Converters.metersToFeet(elevation);
        elevationInFeetPre = 0;
        elevationInFeetPost = 0;

        elevationInUse = elevationInFeet;
      }
      else {
        elevationInFeetPost = Converters.metersToFeet(elevation);
        elevationInFeetPre = 0;
        elevationInFeet = 0;

        elevationInUse = elevationInFeetPost;
      }

      row = [];
      row.push(distanceInMiles);
      row.push(elevationInFeetPre);
      row.push(elevationInFeet);
      row.push(elevationInFeetPost);

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
      ttHtml += 'mi</b><br>Elevation:<b>' + elevationInUse.toFixed(0)
        + 'ft</b><br>Grade:<b>' + gradient.toFixed(1) + '%</b>';
      ttHtml += segmentEffortsAtTimeLabel + '</div>';
      row.push(ttHtml);

      console.log(i);
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
      // colors: ["red", "green", "blue"],
      colors: ['#000000', "green", '#000000'],
      isStacked: false
    };

    let elevationChart = this.elevationChart;
    // var chart = new window.google.visualization.LineChart(elevationChart);
    let chart = new window.google.visualization.AreaChart(elevationChart);

    chart.draw(dataTable, options);
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

  render() {

    if (this.elevationChart && this.props.streams.length > 0) {
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

  onSetLocationCoordinates: React.PropTypes.func.isRequired

};


export default ElevationChart;