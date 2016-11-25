import React, { Component } from 'react';
import { Link } from 'react-router';

const fs = require('fs');
const GeoJSON = require('geojson');

class ActivityMap extends Component {

    constructor(props) {
        super(props);

        this.activityMap = null;
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

// code that may be required to track mouse movements over route
//             self.activityMap.on('mousemove', (mouseEvent) => {
//                 console.log("map onMouseMove:");
//                 console.log(mouseEvent);
//             });

// polyline for activity
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

// create a GeoJSON point to serve as a starting point
            if (self.props.showMarker) {
                let coordinates = [longitudeCenter, latitudeCenter];
                if (self.props.mapLatitudeLongitude && self.props.mapLatitudeLongitude.length > 0) {
                    coordinates = self.props.mapLatitudeLongitude;
                }
                self.markerPoint = {
                    "type": "Point",
                    "coordinates": coordinates
                };
                self.activityMap.addSource('markerLocation', { type: 'geojson', data: self.markerPoint });

                self.activityMap.addLayer({
                    "id": "markerCircle",
                    "type": "circle",
                    "source": "markerLocation",
                    "paint": {
                        "circle-radius": 8,
                        "circle-color": "red",
                        "circle-opacity": 0.8
                    }
                });
            }
        });
    }

    loadAndRenderMap() {

        if (this.activityMap) return;

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

    setMarkerPosition() {
        if (this.props.showMarker) {
            const source = this.activityMap.getSource('markerLocation');
            if (!source) return;

            if (!this.markerPoint) {
                this.markerPoint = {
                    "type": "Point",
                    "coordinates": []
                };

            }
            this.markerPoint.coordinates = this.props.mapLatitudeLongitude;
            source.setData(this.markerPoint);
        }
    }

    buildMapLegend(activitiesData) {

        // for now, only show legend when more than one activity is mapped
        if (activitiesData.length < 2) {
            return (
                <noscript/>
            );
        }

        activitiesData.sort( (activity0, activity1) => {

            const dt0 = new Date(activity0.startDateLocal);
            const dt1 = new Date(activity1.startDateLocal);

            if (dt0 > dt1) {
                return -1;
            }
            return 1;
        });

        // does map iterate in sorted order? if not, iterate through sorted array and assign colors

        let mapLegend = activitiesData.map((activityData, index) => {

            const colorStyle = {
                background: activityData.strokeColor
            };

            const activityDate = new Date(activityData.startDateLocal);
            const legendLabel = activityData.name + " - " + activityDate.toDateString();

            const url = '/detailedActivityContainer/' + activityData.activityId;

            return (
                <div key={activityData.startDateLocal}>
                    <div className="mapLegendActivityRect" style={colorStyle}/>
                    <div className="mapLegendActivityName">
                        <Link to={url}>{legendLabel}</Link>
                    </div>
                    <br/>
                </div>
            );
        });

        return (
            <div>
                {mapLegend}
            </div>
        );
    }

    render() {

        var self = this;

        if (this.activityMap && this.props.showMarker && this.props.mapLatitudeLongitude && this.props.mapLatitudeLongitude.length > 0) {
            this.setMarkerPosition();
        }

        const mapLegendJSX = this.buildMapLegend(this.props.activitiesData);

        return (
            <div id="mapBoxMap"
                ref={(c) => {
                    self.mapBoxMap = c;
                    self.loadAndRenderMap();
                }}>
                { mapLegendJSX }
            </div>
        );
    }
}

ActivityMap.propTypes = {
    totalActivities: React.PropTypes.number.isRequired,
    mapHeight: React.PropTypes.string.isRequired,
    activitiesData: React.PropTypes.array.isRequired,
    showMarker: React.PropTypes.bool.isRequired,
    mapLatitudeLongitude: React.PropTypes.array.isRequired,
};


export default ActivityMap;



