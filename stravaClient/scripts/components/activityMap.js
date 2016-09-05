import React, { Component } from 'react';

let google = null;
let activityMap = null;
let activityPath = null;
let ridePathDecoded = null;

class ActivityMap extends Component {


    componentWillMount() {
        google = window.google;
    }

    initializeMap(activity, mapId) {

        var myLatlng = new google.maps.LatLng(activity.startLatitude, activity.startLongitude);
        var myOptions = {
            zoom: 14,
            center: myLatlng,
            //mapTypeId: google.maps.MapTypeId.TERRAIN
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        var createNewMap;
        if (!activityMap) {
            createNewMap = true;
        }
        else {
            createNewMap = false;
        }

        if (createNewMap) {
            // activityMap = new google.maps.Map(document.getElementById(mapId), myOptions);
            activityMap = new google.maps.Map(document.getElementById(mapId), myOptions);
        }
        else {
            activityMap.setZoom(14);
            activityMap.setCenter(myLatlng);
            if (activityPath != undefined) {
                activityPath.setMap(null);
            }
        }

        var pathToDecode = activity.map.polyline;
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
    }

    render() {

        const activity = this.props.activity;

        if (activity && this.refs.activityGMap && activity.map && activity.map.polyline) {
            this.initializeMap(activity, "activityGMap");
        }

        return (
            <div id="activityGMap" ref="activityGMap"/>
        );

    }
}

export default ActivityMap;
