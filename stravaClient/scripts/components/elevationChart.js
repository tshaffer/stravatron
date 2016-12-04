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

    // if (this.chartDrawn) return false;

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

    var dataTable = new window.google.visualization.DataTable();
    dataTable.addColumn('number', 'Distance');
    dataTable.addColumn('number', 'Elevation');
    dataTable.addColumn({ type: 'string', role: 'tooltip', 'p': { 'html': true } });

    var row = [];
    var mapDistanceToLocation = {};
    let mapDistanceToStreamIndex = {};

    console.log("segmentEffortsForActivity length:", this.props.segmentEffortsForActivity.length);
    console.log("activityStartDateLocal: ", this.props.activityStartDateLocal);
    const activityStartTime = this.props.activityStartDateLocal.getTime();

    for (let i = 0; i < distances.length; i++) {

      var distance = distances[i];
      var elevation = elevations[i];
      var gradient = gradients[i];
      var location = locations[i];

      var distanceInMiles = Converters.metersToMiles(distance);
      var elevationInFeet = Converters.metersToFeet(elevation);

      row = [];
      row.push(distanceInMiles);
      console.log("distanceInMiles: ", distanceInMiles);
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

      var ttHtml = '<div style="padding:5px 5px 5px 5px;">Distance:<b>' + distanceInMiles.toFixed(1);
      ttHtml += 'mi</b><br>Elevation:<b>' + elevationInFeet.toFixed(0)
        + 'ft</b><br>Grade:<b>' + gradient.toFixed(1) + '%</b>';
      ttHtml += segmentEffortsAtTimeLabel + '</div>';
      row.push(ttHtml);

      dataTable.addRow(row);

      const distanceIndex = Converters.metersToMiles(distance).toString();
      mapDistanceToLocation[distanceIndex] = Converters.stravatronCoordinateFromLatLng(location[0], location[1]);
      mapDistanceToStreamIndex[distanceIndex] = i;
    }

    var options = {
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
      width: 1500
    };

    let elevationChart = this.elevationChart;
    var chart = new window.google.visualization.LineChart(elevationChart);

    // chart.draw(dataTable, options);

    let dataView = new window.google.visualization.DataView(dataTable);
    // dataView.setRows(dataView.getFilteredRows([{column: 1, minValue: 300}]));
    dataView.setRows(dataView.getFilteredRows([{column: 0, minValue: 2, maxValue: 10}]));
    chart.draw(dataView, options);
    this.dataTable = dataTable;
    this.dataView = dataView;
    this.chart = chart;
    this.options = options;
    this.distances = distances;

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
      const segmentCreationStartLocation = this.props.locationCoordinates.locationsByUIElement["segmentCreationStart"];
      if (segmentCreationStartLocation) {
        const segmentCreationStartIndex = this.props.locationCoordinates.locationsByUIElement["segmentCreationStart"].index;

        const segmentCreationEndLocation = this.props.locationCoordinates.locationsByUIElement["segmentCreationEnd"];
        if (segmentCreationEndLocation) {
          const segmentCreationEndIndex = this.props.locationCoordinates.locationsByUIElement["segmentCreationEnd"].index;

          const startDistance = Converters.metersToMiles(this.distances[segmentCreationStartIndex]);
          const endDistance = Converters.metersToMiles(this.distances[segmentCreationEndIndex]);

          console.log(startDistance, " : ", endDistance);

          this.dataView = new window.google.visualization.DataView(this.dataTable);
          this.dataView.setRows(this.dataView.getFilteredRows([{column: 0, minValue: startDistance, maxValue: endDistance}]));
          this.chart.draw(this.dataView, this.options);
        }
      }
    }
  }

  render() {

    if (this.chartDrawn) {
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
  markerCount: React.PropTypes.number.isRequired
};


export default ElevationChart;