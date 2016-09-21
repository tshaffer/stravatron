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

        const longitudeCenter = (minLongitude + maxLongitude) / 2.0;
        const latitudeCenter = (minLatitude + maxLatitude) / 2.0;

        window.mapboxgl.accessToken = 'pk.eyJ1IjoidGVkc2hhZmZlciIsImEiOiJjaXN2cjR4dXIwMjgwMm9wZ282cmk0aTgzIn0.9EtSUOr_ofLcwCDLM6FUHw';
        this.activityMap = new window.mapboxgl.Map({
            container: 'mapBoxMap', // container id
            style: 'mapbox://styles/tedshaffer/citagbl4b000h2iqbkgub0t26',
        });

        this.activityMap.addControl(new window.mapboxgl.Navigation());

        this.activityMap.on('load', function () {

            // experiment on adding padding around bounds - instead of a fixed value, perhaps it should be a percentage based on bounds
            const padding = 0.005;
            minLatitude -= padding;
            maxLatitude += padding;

            minLongitude -= padding;
            maxLongitude += padding;

            const minBounds = [
                minLongitude,
                minLatitude
            ];

            const maxBounds = [
                maxLongitude,
                maxLatitude
            ];

            self.activityMap.fitBounds([minBounds, maxBounds]);

            console.log("fitBounds");
            console.log(minBounds);
            console.log(maxBounds);
            
            console.log("initial zoom is:", self.activityMap.getZoom().toString());

            for (let segmentIndex = 0; segmentIndex < self.props.activitiesData.length; segmentIndex++) {

                let sourceName = "segment" + segmentIndex.toString();
                let lineLayerName = "points" + segmentIndex.toString();

                const segmentData = self.props.activitiesData[segmentIndex];

                let pathToDecode = segmentData.polyline;
                let ridePathDecoded = window.google.maps.geometry.encoding.decodePath(pathToDecode);

                let coordinates = [];
                ridePathDecoded.forEach((location) => {
                    let longitude = location.lng();
                    let latitude = location.lat();
                    let lngLat = [longitude, latitude];
                    coordinates.push(lngLat);
                });

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
                        "line-color": segmentData.strokeColor,
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



