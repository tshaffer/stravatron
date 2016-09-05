import React, { Component } from 'react';

import * as Converters from '../utilities/converters';

let activityMap = null;
let activityPath = null;
let ridePathDecoded = null;
let google = null;
let startMarker = null;
let mapMarker = null;


class ElevationChart extends Component {

    componentWillMount() {
        google = window.google;
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

        var dataTable = new google.visualization.DataTable();
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
        var chart = new google.visualization.LineChart(elevationChart);

        chart.draw(dataTable, options);

        // draw marker at the beginning of the ride
        var startLocation = mapDistanceToLocation[dataTable.getValue(0, 0)];
        var startLatlng = new google.maps.LatLng(startLocation[0], startLocation[1]);
        var startMarkerOptions = {
            strokeColor: '#FFFFFF',
            strokeOpacity: 1,
            strokeWeight: 2,
            fillColor: '#00FF00',
            fillOpacity: 1,
            map: activityMap,
            center: startLatlng,
            radius: 50,
            editable: false,
            draggable: false
        };

        startMarker = new google.maps.Circle(startMarkerOptions);

        // Add our over/out handlers.
        google.visualization.events.addListener(chart, 'onmouseover', chartMouseOver);
        google.visualization.events.addListener(chart, 'onmouseout', chartMouseOut);

        // function chartMouseOver(e) {
        //     console.log("chartMouseOver");
        //     chart.setSelection([e]);
        //
        //     var item = chart.getSelection();
        //     if (item != undefined) {
        //         var selectedItem = item[0];
        //         //console.log("item selected:  row=" + selectedItem.row + ", column=" + selectedItem.column);
        //         //console.log("distance is: " + dataTable.getValue(selectedItem.row, 0));
        //         //console.log("elevation is: " + dataTable.getValue(selectedItem.row, selectedItem.column));
        //
        //         var selectedLocation = mapDistanceToLocation[dataTable.getValue(selectedItem.row, 0)];
        //         if (selectedLocation != undefined) {
        //             //console.log("selected location: ");
        //             //console.log(selectedLocation);
        //
        //             //console.log("lat is: " + selectedLocation[0] + ", lng is: " + selectedLocation[1]);
        //             var myLatlng = new google.maps.LatLng(selectedLocation[0], selectedLocation[1]);
        //
        //             // erase old marker, if it existed
        //             if (mapMarker != null) {
        //                 mapMarker.setMap(null);
        //             }
        //
        //             var markerOptions = {
        //                 strokeColor: '#FFFFFF',
        //                 strokeOpacity: 1,
        //                 strokeWeight: 2,
        //                 fillColor: '#0000FF',
        //                 fillOpacity: 1,
        //                 map: activityMap,
        //                 center: myLatlng,
        //                 radius: 50,
        //                 editable: false,
        //                 draggable: false
        //             };
        //
        //             mapMarker = new google.maps.Circle(markerOptions);
        //
        //         }
        //     }
        // }

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

        if (this.refs.elevationChart && this.props.streams) {
            this.buildElevationGraph(this.props.streams);
        }

        return (
            <div id="elevationChart" ref="elevationChart"></div>
        );
    }
}

export default ElevationChart;