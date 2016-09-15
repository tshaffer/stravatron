import React, { Component } from 'react';


class ActivityMap extends Component {

    constructor(props) {
        super(props);

        this.activityMap = null;

        this.mapMarker = null;
    }

    componentDidMount() {
        console.log("activityMap did mount");

        this.forceUpdate();
    }

    updateLayoutProperties(zoom) {

        for (let segmentIndex = 0; segmentIndex < self.props.activitiesData.length; segmentIndex++) {

        }
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
            style: 'mapbox://styles/tedshaffer/cisz745f6003p2wn0kcdy6vay',
            center: [longitudeCenter, latitudeCenter],
            zoom: 11, // starting zoom,
            // maxBounds: lngLatBounds
        });

        this.activityMap.on('zoomend', () => {
            console.log("zoom end");
            console.log("current zoom is:", self.activityMap.getZoom().toString());
        });

        this.activityMap.on('zoomstart', () => {
            console.log("zoomstart");
            console.log("current zoom is:", self.activityMap.getZoom().toString());
        });

        this.activityMap.on('zoom', () => {
            console.log("zoom");
            console.log("current zoom is:", self.activityMap.getZoom().toString());

            const currentZoom = self.activityMap.getZoom();
            let targetTextSize = 10;
            let textOffset = [0, 0];

            if (currentZoom < 12.5) {
                targetTextSize = 8;
                textOffset = [-2, 2.5];
            }
            else if (currentZoom < 13.5) {
                targetTextSize = 10;
            }
            else if (currentZoom < 14.5) {
                targetTextSize = 12;
            }

            self.activityMap.setLayoutProperty("title0", "text-size", targetTextSize);
            self.activityMap.setLayoutProperty("title0", "text-offset", textOffset);
        });

        this.activityMap.on('load', function () {

            console.log("current zoom is:", self.activityMap.getZoom().toString());

            for (let segmentIndex = 0; segmentIndex < self.props.activitiesData.length; segmentIndex++) {

                let sourceName = "segment" + segmentIndex.toString();
                let labelLayerName = "title" + segmentIndex.toString();
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

                // "symbol-placement": "line",
                // One of point, line

                // "text-anchor": "top",
                // One of center, left, right, top, bottom, top-left, top-right, bottom-left, bottom-right

                // text-offset
                // Optional array.  Units in ems. Defaults to 0,0. Requires text-field.
                //     Offset distance of text from its anchor. Positive values indicate right and down, while negative values indicate left and up.

                const segmentData = self.props.activitiesData[segmentIndex];

                let segmentName = segmentData.segmentData.name;
                let textSize = null;
                let textAnchor = null;
                let textOffset = null;

                if (segmentData.segmentData.layoutSettingsByZoom) {
                    textSize = segmentData.segmentData.layoutSettingsByZoom[0]["text-size"];
                    textAnchor = segmentData.segmentData.layoutSettingsByZoom[0]["text-anchor"];
                    textOffset = segmentData.segmentData.layoutSettingsByZoom[0]["text-offset"];
                }
                else {
                    textSize = segmentData.segmentData.textSize;
                    textAnchor = segmentData.segmentData.textAnchor;
                    textOffset = segmentData.segmentData.textOffset;
                }

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
                                "title": segmentName
                            }
                        }]
                    }
                });

                self.activityMap.addLayer({
                    "id": labelLayerName,
                    "type": "symbol",
                    "source": sourceName,
                    "layout": {
                        "symbol-placement": "point",
                        "text-field": "{title}",
                        "text-size": textSize,
                        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                        "text-offset": textOffset,
                        "text-anchor": textAnchor,
                        "text-allow-overlap": true,
                        "text-ignore-placement": true,
                        "text-max-angle": 360
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
