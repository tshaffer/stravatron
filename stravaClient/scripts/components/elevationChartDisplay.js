import React from 'react';
import ElevationChart from './elevationChart';

import * as Converters from '../utilities/converters';

let segmentStartDistance = null;
let segmentEndDistance = null;

class ElevationChartDisplay extends ElevationChart {

  buildElevationGraph(stream) {

    const streams = this.getStreamData(stream);
    if (!streams) return;

    const { distances } = streams;

    let dataTable = new window.google.visualization.DataTable();
    dataTable.addColumn('number', 'Distance');
    dataTable.addColumn('number', 'ElevationPre');
    dataTable.addColumn('number', 'Elevation');
    dataTable.addColumn('number', 'ElevationPost');
    dataTable.addColumn({ type: 'string', role: 'tooltip', 'p': { 'html': true } });


    for (let i = 0; i < distances.length; i++) {

      let { distanceInMiles, elevationInFeet, ttHtml } = this.getRowData(i, streams);

      let row = [];
      row.push(distanceInMiles);
      row.push(elevationInFeet);
      row.push(elevationInFeet);
      row.push(elevationInFeet);
      row.push(ttHtml);

      dataTable.addRow(row);
    }

    let elevationChart = this.elevationChart;

    let chart;
    chart = new window.google.visualization.AreaChart(elevationChart);
    this.dataTable = dataTable;
    this.chart = chart;
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

  preRender() {

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
    return null;
  }
}

export default ElevationChartDisplay;