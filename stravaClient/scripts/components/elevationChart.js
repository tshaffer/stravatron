import React, { Component } from 'react';

import * as Converters from '../utilities/converters';

class ElevationChart extends Component {

    buildElevationGraph(activity) {

        if (!activity) return;

        let streams = activity.streams;
        if (!streams) return;

        let distances;
        let elevations;
        let gradients;
        let locations;

        // at this point, stream is an array that includes a number of streams; need to pick out the required stream data
        for (let i = 0; i < streams.length; i++) {
            switch (streams[i].type) {
                case 'distance':
                    distances = streams[i].data;
                    break;
                case 'altitude':
                    elevations = streams[i].data;
                    break;
                case 'grade_smooth':
                    gradients = streams[i].data;
                    break;
                case 'latlng':
                    locations = streams[i].data;
                    break;
            }
        }

        if (distances == undefined || elevations == undefined || gradients == undefined || locations == undefined) {
            console.log("stream undefined");
            return;
        }

        var dataTable = new google.visualization.DataTable();
        dataTable.addColumn('number', 'Distance');
        dataTable.addColumn('number', 'Elevation');
        dataTable.addColumn({ type: 'string', role: 'tooltip', 'p': { 'html': true } });

        var row = [];
        var mapDistanceToLocation = {};

        for (let i = 0; i < distances.length; i++) {

            let distance = distances[i];
            let elevation = elevations[i];
            let gradient = gradients[i];
            let location = locations[i];

            let distanceInMiles = Converters.metersToMiles(distance);
            let elevationInFeet = Converters.metersToFeet(elevation);

            let row = [];
            row.push(distanceInMiles);
            row.push(elevationInFeet);

            let ttHtml = '<div style="padding:5px 5px 5px 5px;">Distance:<b>' + distanceInMiles.toFixed(1) + 'mi</b><br>Elevation:<b>' + elevationInFeet.toFixed(0) + 'ft</b><br>Grade:<b>' + gradient.toFixed(1) + '%</b></div>';
            row.push(ttHtml);

            dataTable.addRow(row);

            mapDistanceToLocation[Converters.metersToMiles(distance).toString()] = location;
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
            //curveType: 'function'
            width: 1800
        };

        let elevationChart = this.refs.elevationChart;
        let chart = new google.visualization.LineChart(elevationChart);

        chart.draw(dataTable, options);
    }

    render() {

        this.buildElevationGraph(this.props.activity);

        return (
            <div id="elevationChart" ref="elevationChart"></div>
        );
    }

}

export default ElevationChart;
