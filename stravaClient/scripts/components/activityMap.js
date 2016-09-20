import React, { Component } from 'react';
const fs = require('fs');
const GeoJSON = require('geojson');

class ActivityMap extends Component {

    constructor(props) {
        super(props);

        this.activityMap = null;
    }

    componentDidMount() {
        console.log("activityMap did mount");
    }

    initializeMap(mapId) {

        var self = this;

        let minLongitude = 9999;
        let maxLongitude = -9999;
        let minLatitude = 9999;
        let maxLatitude = -9999;

        for (let segmentIndex = 0; segmentIndex < self.props.activitiesData.length; segmentIndex++) {
            let pathToDecode = self.props.activitiesData[segmentIndex].polyline;
            let ridePathDecoded = window.google.maps.geometry.encoding.decodePath(pathToDecode);
            ridePathDecoded.forEach((location) => {
                let longitude = location.lng();
                let latitude = location.lat();

                if (longitude > maxLongitude) maxLongitude = longitude;
                if (longitude < minLongitude) minLongitude = longitude;

                if (latitude > maxLatitude) maxLatitude = latitude;
                if (latitude < minLatitude) minLatitude = latitude;

            });
        }

        // Setting the bounds of the map isn't working
        // const sw = new window.mapboxgl.LngLat(-122.08476000000002, 37.028940000000006);
        // const ne = new window.mapboxgl.LngLat(-122.04053, 36.95910000000001);
        // const lngLatBounds = new window.mapboxgl.LngLatBounds(sw, ne);
        // // lngLatBounds = new window.mapboxgl.LngLatBounds(
        // //     new window.mapboxgl.LngLat(minLongitude, minLatitude),
        // //     new window.mapboxgl.LngLat(maxLongitude, maxLatitude)
        // // );

        const longitudeCenter = (minLongitude + maxLongitude) / 2.0;
        const latitudeCenter = (minLatitude + maxLatitude) / 2.0;

        window.mapboxgl.accessToken = 'pk.eyJ1IjoidGVkc2hhZmZlciIsImEiOiJjaXN2cjR4dXIwMjgwMm9wZ282cmk0aTgzIn0.9EtSUOr_ofLcwCDLM6FUHw';
        this.activityMap = new window.mapboxgl.Map({
            container: 'mapBoxMap', // container id
            // style: 'mapbox://styles/tedshaffer/cisvr76by00122xodeod1qclj',
            style: 'mapbox://styles/tedshaffer/citagbl4b000h2iqbkgub0t26',
            center: [longitudeCenter, latitudeCenter],
            zoom: 11, // starting zoom,
            // maxBounds: lngLatBounds
        });

        this.activityMap.on('load', function () {

            console.log("current zoom is:", self.activityMap.getZoom().toString());

            for (let segmentIndex = 0; segmentIndex < self.props.activitiesData.length; segmentIndex++) {

                let sourceName = "segment" + segmentIndex.toString();
                let lineLayerName = "points" + segmentIndex.toString();

                let pathToDecode = self.props.activitiesData[segmentIndex].polyline;
                let ridePathDecoded = window.google.maps.geometry.encoding.decodePath(pathToDecode);

                let coordinates = [];
                ridePathDecoded.forEach((location) => {
                    let longitude = location.lng();
                    let latitude = location.lat();
                    let lngLat = [longitude, latitude];
                    coordinates.push(lngLat);
                });

                const segmentData = self.props.activitiesData[segmentIndex];

                self.activityMap.addSource(sourceName, {
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
                                "title": "segment" + segmentIndex.toString()
                            }
                        }]
                    }
                });

                self.activityMap.addLayer({
                    "id": lineLayerName,
                    "type": "line",
                    "source": sourceName,
                    "layout": {
                        "line-join": "round",
                        "line-cap": "round",
                    },
                    "paint": {
                        "line-color": "red",
                        "line-width": 2
                    }
                });
            }
        });
    }

    loadAndRenderMap() {

        if (this.activityMap) return;

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
        }
    }

    render() {

        var self = this;

        return (
            <div id="mapBoxMap" ref={(c) => {
                self.mapBoxMap = c;
                console.log("ref time:", self.props.activitiesData.length.toString());
                self.loadAndRenderMap();
            }}/>
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



