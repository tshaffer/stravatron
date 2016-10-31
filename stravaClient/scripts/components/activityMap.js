import React, { Component } from 'react';
import { Link } from 'react-router';

const fs = require('fs');
const https = require('https');
const GeoJSON = require('geojson');

class ActivityMap extends Component {

    constructor(props) {
        super(props);

        this.activityMap = null;

        this.geoJSONCoordinates = [];
    }

    addGeoJSONSegment(segmentName, segmentCoordinates) {

        const segmentPointInterval = 10;
        const numCoordinates = segmentCoordinates.length;

        let coordinateIndex = 0;
        while (coordinateIndex < numCoordinates) {

            this.geoJSONCoordinates.push(
                {
                    title: segmentName + "-" + coordinateIndex.toString(),
                    x: segmentCoordinates[coordinateIndex][1],
                    y: segmentCoordinates[coordinateIndex][0]
                }
            );

            coordinateIndex += segmentPointInterval;
        }

        if (numCoordinates % segmentPointInterval != 0) {
            this.geoJSONCoordinates.push(
                {
                    title: segmentName + "-" + coordinateIndex.toString(),
                    x: segmentCoordinates[numCoordinates - 1][1],
                    y: segmentCoordinates[numCoordinates - 1][0]
                }
            );
        }

        this.geoJSONCoordinates.push(
            {
                title: segmentName,
                line: segmentCoordinates
            }
        );
    }

    writeGeoJSONSegments() {

        const geoJSON = GeoJSON.parse(this.geoJSONCoordinates, {'Point': ['x', 'y'], 'LineString': 'line'});
        const geoJSONAsStr = JSON.stringify(geoJSON, null, '\t');
        const fileName = "segments.geojson";
        console.log("save file ", fileName);
        fs.writeFile(fileName, geoJSONAsStr, (err) => {
            if (err) debugger;
            console.log(fileName, " write complete");
        });
    }

    writeGeoJSONSegment(segmentName, segmentCoordinates) {

        let segmentGeometry = [];

        // add point at start of segment
        const pointPropValue = "Start of " + segmentName;
        segmentGeometry[0] =
        {
            x: segmentCoordinates[0][1],
            y: segmentCoordinates[0][0],
            title: pointPropValue,
            location: pointPropValue
        };

        // line segments
        segmentGeometry[1] =
        {
            line: segmentCoordinates,
            title: segmentName,
            segment: segmentName
        };

        const geoJSON = GeoJSON.parse(segmentGeometry, {'Point': ['x', 'y'], 'LineString': 'line'});
        const geoJSONAsStr = JSON.stringify(geoJSON, null, '\t');
        const fileName = segmentName + ".geojson";
        console.log("save file ", fileName);
        fs.writeFile(fileName, geoJSONAsStr, (err) => {
            if (err) debugger;
            console.log(fileName, " write complete");
        });

    }

    fetchMapboxData() {

        // list styles
        // curl "https://api.mapbox.com/styles/v1/{username}?access_token=your-access-token"
        // var options = {
        //     host: 'api.mapbox.com',
        //     path: '/styles/v1/tedshaffer?' + 'access_token=' + 'sk.eyJ1IjoidGVkc2hhZmZlciIsImEiOiJjaXYxYzB4dHowMDlhMnptcGlnaGdkM2s5In0.MR9A5fBMJUhLvyTGjre1sQ',
        //     port: 443
        // };
        //
        // var str = "";
        //
        // https.get(options, function (res) {
        //     res.on('data', function (d) {
        //         str += d;
        //     });
        //     res.on('end', function () {
        //         console.log(str);
        //         var data = JSON.parse(str);
        //         console.log(data);
        //     });
        //
        // }).on('error', function (err) {
        //     console.log('Caught exception: ' + err);
        // });

        // retrieve a style
        // curl "https://api.mapbox.com/styles/v1/{username}/{style_id}?access_token=your-access-token"
        var options = {
            host: 'api.mapbox.com',
            path: '/styles/v1/tedshaffer/' + 'ciuzwjznu00lk2jqnhaoble89' + '?access_token=' + 'sk.eyJ1IjoidGVkc2hhZmZlciIsImEiOiJjaXYxYzB4dHowMDlhMnptcGlnaGdkM2s5In0.MR9A5fBMJUhLvyTGjre1sQ',
            port: 443
        };

        var str = "";

        let self = this;

        https.get(options, function (res) {
            res.on('data', function (d) {
                str += d;
            });
            res.on('end', function () {
                console.log(str);
                var data = JSON.parse(str);
                console.log(data);
                // self.updateStyle(data);
                // self.addStyle(data);
            });

        }).on('error', function (err) {
            console.log('Caught exception: ' + err);
        });


    }

    addStyle(style) {

        debugger;

        const myStyle =
            {
                "version": 8,
                "name": "My Really Awesome Style",
                "metadata": { },
                "sources": {
                    "myvectorsource": {
                        "url": "mapbox://{map_id}",
                        "type": "vector"
                    },
                    "myrastersource": {
                        "url": "mapbox://{map_id}",
                        "type": "raster"
                    }
                },
                "glyphs": "mapbox://fonts/{username}/{fontstack}/{range}.pbf",
                "layers": [ ]
            };

        console.log("stylePoo1");
        console.log("stylePoo1");
        style.layers.splice(224, 2);

        // let postData= JSON.stringify(style);
        let postData= JSON.stringify(myStyle);

        const postOptions = {
            host: 'api.mapbox.com',
            path: '/styles/v1/tedshaffer?access_token=' + 'sk.eyJ1IjoidGVkc2hhZmZlciIsImEiOiJjaXYxYzB4dHowMDlhMnptcGlnaGdkM2s5In0.MR9A5fBMJUhLvyTGjre1sQ',
            port: 443,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        let postReq = https.request(postOptions, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.log('Response: ' + chunk);
            });
            res.on('end', () => {
                console.log('No more data in response.');
            });
        });

        postReq.on('error', (e) => {
            console.log(`problem with request: ${e.message}`);
        });

        // write data to request body
        postReq.write(postData);
        postReq.end();
    }

    updateStyle(style) {
        console.log("poo1");
        console.log("poo1");
        style.layers.splice(224, 2);


        // var options = {
        //     host: 'api.mapbox.com',
        //     path: '/styles/v1/tedshaffer/' + 'ciuzwjznu00lk2jqnhaoble89' + '?access_token=' + 'sk.eyJ1IjoidGVkc2hhZmZlciIsImEiOiJjaXYxYzB4dHowMDlhMnptcGlnaGdkM2s5In0.MR9A5fBMJUhLvyTGjre1sQ',
        //     port: 443,
        //     method: 'PATCH',
        //     headers: "Content-Type:application/json"
        // };
        //
        // var req = https.request(options, function (res) {
        //     res.on('data', function (d) {
        //         str += d;
        //     });
        //     res.on('end', function () {
        //         console.log(str);
        //         var data = JSON.parse(str);
        //         console.log(data);
        //         self.updateStyle(data);
        //     });
        //
        // }).on('error', function (err) {
        //     console.log('Caught exception: ' + err);
        // });

    }

    initializeMap(mapId) {

        // this.fetchMapboxData();

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

            const style = self.activityMap.getStyle();
            // const retVal = self.activityMap.setStyle(style);

            self.mapBoxStyle = style;

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

                let segmentName = segmentData.segmentData.name;
                console.log(segmentName, " is index ", segmentIndex);
                self.writeGeoJSONSegment(segmentName, coordinates);
                self.addGeoJSONSegment(segmentName, coordinates);

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
            self.writeGeoJSONSegments();

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

    poo() {

        console.log("poo poopers");

        let myFilter = [];
        myFilter.push('==');
        myFilter.push('title');
        myFilter.push('XC-40');

        let myLayout = {};
        myLayout['text-anchor'] = 'bottom-left';
        myLayout['text-field'] = 'pizza';
        myLayout['text-size'] = 9;

        let myLayer = {};
        myLayer.id = 'label69';
        myLayer.type = 'symbol';
        myLayer.source = 'composite';
        myLayer.layout = myLayout;
        myLayer['source-layer'] = 'segmentsAndPoints';
        myLayer.filter = myFilter;

        this.mapBoxStyle.layers.push(myLayer);

        const retVal = this.activityMap.setStyle(this.mapBoxStyle);
        console.log("poopers");
    }

    handleMouseDown(event) {
        console.log("handleMouseDown");
        console.log(event);
    }

    render() {

        var self = this;

        if (this.activityMap && this.props.showMarker && this.props.mapLatitudeLongitude && this.props.mapLatitudeLongitude.length > 0) {
            this.setMarkerPosition();
        }

        const mapLegendJSX = this.buildMapLegend(this.props.activitiesData);

        return (
            <div id="mapBoxMap"
                onMouseDown={self.handleMouseDown}
                ref={(c) => {
                    self.mapBoxMap = c;
                    self.loadAndRenderMap();
                }}>
                <button onClick={() => self.poo()}>poo</button>
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



