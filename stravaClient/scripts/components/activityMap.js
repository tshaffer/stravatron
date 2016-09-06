import React, { Component } from 'react';


class ActivityMap extends Component {

    constructor(props) {
        super(props);

        this.mapMarker = null;
    }

    initializeMap(mapId) {

        var myLatlng = new window.google.maps.LatLng(this.props.startLatitude, this.props.startLongitude);
        var myOptions = {
            zoom: 14,
            center: myLatlng,
            mapTypeId: window.google.maps.MapTypeId.ROADMAP
        };

        var createNewMap;
        if (!this.activityMap) {
            createNewMap = true;
        }
        else {
            createNewMap = false;
        }

        if (createNewMap) {
            this.activityMap = new window.google.maps.Map(document.getElementById(mapId), myOptions);
        }
        else {
            this.activityMap.setZoom(14);
            this.activityMap.setCenter(myLatlng);
            // if (activityPath != undefined) {
            //     activityPath.setMap(null);
            // }
        }

        var pathToDecode = this.props.mapPolyline;
        const ridePathDecoded = window.google.maps.geometry.encoding.decodePath(pathToDecode);

        var existingBounds = this.activityMap.getBounds();

        var bounds = new window.google.maps.LatLngBounds();
        ridePathDecoded.forEach( (location) => {
            bounds.extend(location);
        });

        if (createNewMap) {
            this.activityMap.fitBounds(bounds);
        }
        else {
            setTimeout(function () { this.activityMap.fitBounds(bounds); }, 1);
        }
        let activityPath = new window.google.maps.Polyline({
            path: ridePathDecoded,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 2,
            map: this.activityMap
        });

        this.drawMarker();
    }


    drawMarker() {

        if (!this.props.location) return;

        const markerLocation = new window.google.maps.LatLng(this.props.location[0], this.props.location[1]);

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
            map: this.activityMap,
            center: markerLocation,
            radius: 50,
            editable: false,
            draggable: false
        };

        this.mapMarker = new window.google.maps.Circle(markerOptions);
    }

    render() {

        if (this.refs.activityGMap && this.props.mapPolyline) {
            if (!this.activityMap) {
                this.initializeMap("activityGMap");
            }

            if (this.props.location) {
                this.drawMarker();
            }
        }

        return (
            <div id="activityGMap" ref="activityGMap"/>
        );
    }
}

export default ActivityMap;
