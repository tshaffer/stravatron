import React, { Component } from 'react';


class ActivityMap extends Component {

    constructor(props) {
        super(props);

        this.activityMap = null;

        this.mapMarker = null;
    }

    componentDidMount() {
        console.log("activityMap did mount");
    }

    initializeMap(mapId) {

        var self = this;

        window.mapboxgl.accessToken = 'pk.eyJ1IjoidGVkc2hhZmZlciIsImEiOiJjaXN2cjR4dXIwMjgwMm9wZ282cmk0aTgzIn0.9EtSUOr_ofLcwCDLM6FUHw';
        this.activityMap = new window.mapboxgl.Map({
            container: 'mapBoxMap', // container id
            style: 'mapbox://styles/tedshaffer/cisvr76by00122xodeod1qclj',
            center: [-122.061, 37.007], // starting position
            zoom: 13 // starting zoom
        });

        debugger;
        const pathToDecode = this.props.activitiesData[0].polyline;
        const ridePathDecoded = window.google.maps.geometry.encoding.decodePath(pathToDecode);

        let coordinates = [];
        ridePathDecoded.forEach( (location) => {
            let longitude = location.lng();
            let latitude = location.lat();
            let lngLat = [ longitude, latitude ];
            coordinates.push(lngLat);
        });

        const fixedCoordinates = [
            [-122.05525000000002, 37.00222],
            [-122.05459, 37.002250000000004],
            [-122.05329, 37.002250000000004],
            [-122.05259000000001, 37.00217],
            [-122.05243000000002, 37.00213],
            [-122.05210000000001, 37.002100000000006],
            [-122.05204, 37.002210000000005],
            [-122.05195, 37.002190000000006],
            [-122.05167000000002, 37.00238],
            [-122.05168, 37.00251],
            [-122.05219000000001, 37.002880000000005],
            [-122.05283000000001, 37.00311],
            [-122.05299000000001, 37.003150000000005],
            [-122.05335000000001, 37.003350000000005],
            [-122.05362000000001, 37.00363]
        ];

        this.activityMap.on('load', function () {

            self.activityMap.addSource("points", {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": [{
                        "type": "Feature",
                        "geometry": {
                            "type": "LineString",
                            "coordinates": coordinates,
                        },
                        "properties": {
                            "title": "Poop"
//                        "icon": "harbor"
                        }
                    }]
                }
            });

            self.activityMap.addLayer({
                "id": "title",
                "type": "symbol",
                "source": "points",
                "layout": {
                    "symbol-placement": "line",
                    "icon-image": "{icon}-15",
                    "text-field": "{title}",
                    "text-size": 8,
                    "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                    "text-offset": [0, 0],
                    "text-anchor": "top"
                }
            });

            self.activityMap.addLayer({
                "id": "points",
                "type": "line",
                "source": "points",
                "layout": {
                    "line-join": "round",
                    "line-cap": "round",
                },
                "paint": {
                    "line-color": "#888",
                    "line-width": 2
                }
            });
        });

        // var myLatlng = new window.google.maps.LatLng(this.props.startLatitude, this.props.startLongitude);
        // var myOptions = {
        //     // zoom: 14,
        //     zoom: 13,
        //     center: myLatlng,
        //     mapTypeId: window.google.maps.MapTypeId.ROADMAP
        // };
        //
        // var createNewMap;
        // if (!this.activityMap) {
        //     createNewMap = true;
        // }
        // else {
        //     createNewMap = false;
        // }
        //
        // if (createNewMap) {
        //     this.activityMap = new window.google.maps.Map(document.getElementById(mapId), myOptions);
        // }
        // else {
        //     this.activityMap.setZoom(10);
        //     this.activityMap.setCenter(myLatlng);
        //     // if (activityPath != undefined) {
        //     //     activityPath.setMap(null);
        //     // }
        // }

        // const pathToDecode = this.props.activitiesData[0].polyline;
        // const ridePathDecoded = window.google.maps.geometry.encoding.decodePath(pathToDecode);

        // var existingBounds = this.activityMap.getBounds();

        // var bounds = new window.google.maps.LatLngBounds();
        // ridePathDecoded.forEach( (location) => {
        //     bounds.extend(location);
        // });

        // if (createNewMap) {
        //     this.activityMap.fitBounds(bounds);
        // }
        // else {
        //     setTimeout(function () { this.activityMap.fitBounds(bounds); }, 1);
        // }

        // for (let i = 0; i < this.props.activitiesData.length; i++) {
        //
        //     const activityData = this.props.activitiesData[i];
        //
        //     const activityPath = activityData.polyline;
        //     const strokeColor = activityData.strokeColor;
        //     const activityPathDecoded = window.google.maps.geometry.encoding.decodePath(activityPath);
        //
        //     console.log("draw polyline");
        //     let polyline = new window.google.maps.Polyline({
        //         path: activityPathDecoded,
        //         strokeColor: strokeColor,
        //         strokeOpacity: 1.0,
        //         strokeWeight: 2,
        //         map: this.activityMap
        //     });
        // }

        // this.drawMarker();
    }

    // drawMarker() {
    //
    //     if (!this.props.location || this.props.location.length == 0) return;
    //
    //     const markerLocation = new window.google.maps.LatLng(this.props.location[0], this.props.location[1]);
    //
    //     // erase old marker, if it existed
    //     if (this.mapMarker != null) {
    //         this.mapMarker.setMap(null);
    //     }
    //
    //     // draw marker at specified location
    //     var markerOptions = {
    //         strokeColor: '#FFFFFF',
    //         strokeOpacity: 1,
    //         strokeWeight: 2,
    //         fillColor: '#00FF00',
    //         fillOpacity: 1,
    //         map: this.activityMap,
    //         center: markerLocation,
    //         radius: 50,
    //         editable: false,
    //         draggable: false
    //     };
    //
    //     this.mapMarker = new window.google.maps.Circle(markerOptions);
    // }
    //
    render() {

        // ensure that all map data has loaded
        console.log("number of lines is ", this.props.activitiesData.length);
        console.log("total activities is ", this.props.totalActivities);

        let allDataLoaded = true;
        if (this.props.activitiesData.length == this.props.totalActivities) {
            this.props.activitiesData.forEach( (activityData) => {
                if (activityData.polyline == "") {
                    allDataLoaded = false;
                }
            });
        }
        else {
            allDataLoaded = false;
        }

        if (this.mapBoxMap && allDataLoaded) {

            this.mapBoxMap.style.height = this.props.mapHeight;

            if (!this.activityMap) {
                this.initializeMap("mapBoxMap");
            }

            // if (this.props.location && this.props.location.length > 0) {
            //     this.drawMarker();
            // }
        }

        // <div id="activityGMap" ref={(c) => { this.activityGMap = c; }}/>

        return (
            <div id="mapBoxMap" ref={(c) => { this.mapBoxMap = c; }}/>
        );
    }
}

ActivityMap.propTypes = {
    startLatitude: React.PropTypes.number.isRequired,
    startLongitude: React.PropTypes.number.isRequired,
    location: React.PropTypes.array.isRequired,
    totalActivities: React.PropTypes.number.isRequired,
    mapHeight: React.PropTypes.string.isRequired,
    activitiesData: React.PropTypes.array.isRequired
};


export default ActivityMap;
