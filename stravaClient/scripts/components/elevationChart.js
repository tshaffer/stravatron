import React, { Component } from 'react';

import * as Converters from '../utilities/converters';

class ElevationChart extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
        this.chartDrawn = false;
    }

    shouldComponentUpdate(nextProps, nextState) {

        if (this.chartDrawn) return false;

        return true;
    }

    buildElevationGraph(stream) {

        var distances;
        var elevations;
        var gradients;
        var locations;

        // at this point, stream is an array that includes a number of streams; need to pick out the required stream data
        for (let i = 0; i < stream.length; i++) {
            switch (stream[i].type) {
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

        if (distances == undefined || elevations == undefined || gradients == undefined || locations == undefined) {
            console.log("stream undefined");
            return;
        }

        var dataTable = new window.google.visualization.DataTable();
        dataTable.addColumn('number', 'Distance');
        dataTable.addColumn('number', 'Elevation');
        dataTable.addColumn({ type: 'string', role: 'tooltip', 'p': { 'html': true } });

        var row = [];
        var mapDistanceToLocation = {};

        for (let i = 0; i < distances.length; i++) {

            var distance = distances[i];
            var elevation = elevations[i];
            var gradient = gradients[i];
            var location = locations[i];

            var distanceInMiles = Converters.metersToMiles(distance);
            var elevationInFeet = Converters.metersToFeet(elevation);

            row = [];
            row.push(distanceInMiles);
            row.push(elevationInFeet);

            var ttHtml = '<div style="padding:5px 5px 5px 5px;">Distance:<b>' + distanceInMiles.toFixed(1) + 'mi</b><br>Elevation:<b>' + elevationInFeet.toFixed(0) + 'ft</b><br>Grade:<b>' + gradient.toFixed(1) + '%</b></div>';
            row.push(ttHtml);

            dataTable.addRow(row);

            mapDistanceToLocation[Converters.metersToMiles(distance).toString()] = Converters.stravatronCoordinateFromLatLng(location[0], location[1]);
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

        chart.draw(dataTable, options);
        this.chartDrawn = true;

        // initialize starting location so that marker appears at the beginning of the route
        var startingLocation = mapDistanceToLocation[dataTable.getValue(0, 0)];
        this.props.onLocationChanged(startingLocation);

        // Add our over/out handlers.
        window.google.visualization.events.addListener(chart, 'onmouseover', chartMouseOver);
        window.google.visualization.events.addListener(chart, 'onmouseout', chartMouseOut);

        let self = this;

        function chartMouseOver(e) {

            chart.setSelection([e]);

            let item = chart.getSelection();
            if (item != undefined) {
                var selectedItem = item[0];

                var selectedLocation = mapDistanceToLocation[dataTable.getValue(selectedItem.row, 0)];
                if (selectedLocation != undefined) {
                    self.props.onLocationChanged(selectedLocation);
                }
            }
        }

        function chartMouseOut(e) {
            chart.setSelection([{ 'row': null, 'column': null }]);
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
    streams: React.PropTypes.array.isRequired
};


export default ElevationChart;