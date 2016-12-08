import ElevationChart from './elevationChart';

import * as Converters from '../utilities/converters';

class InteractiveElevationChart extends ElevationChart {

  componentWillMount() {
    // initialize location so that activity map draws marker appropriately
    const index = 0;
    const location = this.props.activityLocations[index];
    this.props.onSetLocationCoordinates("elevationChart", index, location);
  }

  shouldComponentUpdate() {

    if (this.chartDrawn) return false;
    return true;
  }

  buildElevationGraph(stream) {

    const streams = this.getStreamData(stream);
    if (!streams) return;

    const { distances } = streams;

    let dataTable = new window.google.visualization.DataTable();
    dataTable.addColumn('number', 'Distance');
    dataTable.addColumn('number', 'Elevation');
    dataTable.addColumn({ type: 'string', role: 'tooltip', 'p': { 'html': true } });

    let mapDistanceToLocation = {};
    let mapDistanceToStreamIndex = {};

    for (let i = 0; i < distances.length; i++) {

      let { distance, location, distanceInMiles, elevationInFeet, ttHtml } = this.getRowData(i, streams);

      let row = [];
      row.push(distanceInMiles);
      row.push(elevationInFeet);
      row.push(ttHtml);

      dataTable.addRow(row);

      const distanceIndex = Converters.metersToMiles(distance).toString();
      mapDistanceToLocation[distanceIndex] = Converters.stravatronCoordinateFromLatLng(location[0], location[1]);
      mapDistanceToStreamIndex[distanceIndex] = i;
    }

    let elevationChart = this.elevationChart;

    let chart = new window.google.visualization.LineChart(elevationChart);
    chart.draw(dataTable, this.options);
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

  preRender() {
    if (this.elevationChart) {
      this.buildElevationGraph(this.props.streams);
    }
    return null;
  }

}

export default InteractiveElevationChart;