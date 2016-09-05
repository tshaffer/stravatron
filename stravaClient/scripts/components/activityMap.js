import React, { Component } from 'react';

let google = null;
let activityMap = null;
let activityPath = null;
let ridePathDecoded = null;
let markerLocation = null;

class ActivityMap extends Component {

    constructor(props) {
        super(props);

        this.mapMarker = null;
    }

    componentWillMount() {
        google = window.google;
    }

    initializeMap(mapId) {

        var myLatlng = new google.maps.LatLng(this.props.startLatitude, this.props.startLongitude);
        var myOptions = {
            zoom: 14,
            center: myLatlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var createNewMap;
        if (!activityMap) {
            createNewMap = true;
        }
        else {
            createNewMap = false;
        }

        if (createNewMap) {
            activityMap = new google.maps.Map(document.getElementById(mapId), myOptions);
        }
        else {
            activityMap.setZoom(14);
            activityMap.setCenter(myLatlng);
            if (activityPath != undefined) {
                activityPath.setMap(null);
            }
        }

        var pathToDecode = this.props.mapPolyline;
        ridePathDecoded = google.maps.geometry.encoding.decodePath(pathToDecode);

        var existingBounds = activityMap.getBounds();

        var bounds = new google.maps.LatLngBounds();
        ridePathDecoded.forEach( (location) => {
            bounds.extend(location);
        });

        if (createNewMap) {
            activityMap.fitBounds(bounds);
        }
        else {
            setTimeout(function () { activityMap.fitBounds(bounds); }, 1);
        }
        activityPath = new google.maps.Polyline({
            path: ridePathDecoded,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 2,
            map: activityMap
        });

        this.drawMarker();
    }


    drawMarker() {

        markerLocation = ridePathDecoded[0];
        if (this.props.location) {
            markerLocation = new google.maps.LatLng(this.props.location[0], this.props.location[1]);
        }

        // erase old marker, if it existed
        if (this.mapMarker != null) {
            this.mapMarker.setMap(null);
        }

        // draw marker at specified location
        var markerOptions = {
            strokeColor: '#FFFFFF',
            strokeOpacity: 1,
            strokeWeight: 2,
            fillColor: '#00FF00',
            fillOpacity: 1,
            map: activityMap,
            center: markerLocation,
            radius: 50,
            editable: false,
            draggable: false
        };

        this.mapMarker = new google.maps.Circle(markerOptions);
    }

    render() {

        if (this.refs.activityGMap && this.props.mapPolyline) {
            if (!activityMap) {
                this.initializeMap("activityGMap");
            }

            if (this.props.location) {
                if (markerLocation[0] != this.props.location[0] || markerLocation[1] != this.props.location[1]) {
                    this.drawMarker();
                }
            }
        }

        return (
            <div id="activityGMap" ref="activityGMap"/>
        );

    }
}

export default ActivityMap;
