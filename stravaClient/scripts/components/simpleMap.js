import { default as React, Component } from "react";

import { GoogleMap, Marker, Polyline } from "react-google-maps";

class SimpleMap extends Component {

    decodeLevels(encodedLevelsString) {
        var decodedLevels = [];

        for (var i = 0; i < encodedLevelsString.length; ++i) {
            var level = encodedLevelsString.charCodeAt(i) - 63;
            decodedLevels.push(level);
        }
        return decodedLevels;
    }


    render() {
        /*
         * 2. Render GoogleMap component with containerProps
         */
        // height: `100%`,
        // mapTypeId={'satellite'}

        const mapCenter = {
            lat: this.props.startLatitude,
            lng: this.props.startLongitude
        };


        if (this.props.mapPolyline) {

            let pathToDecode = this.props.mapPolyline;
            let ridePathDecoded = google.maps.geometry.encoding.decodePath(pathToDecode);
            var decodedLevels = this.decodeLevels("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");

            var bounds = new google.maps.LatLngBounds();
            ridePathDecoded.forEach( (location) => {
                bounds.extend(location);
            });

            bounds={ bounds };

            // <Marker
            //     position= { mapCenter }
            // />

            return (
                <GoogleMap
                    containerProps={{
                        style: {
                            height: 400,
                        },
                    }}
                    defaultZoom={this.props.zoom}
                    center={ mapCenter }
                    mapTypeId={ google.maps.MapTypeId.ROADMAP }
                    bounds={ bounds }
                >
                    <Polyline
                        path ={ridePathDecoded}
                        levels = {decodedLevels}
                        strokeColor = "#FF0000"
                        strokeOpacity = "1.0"
                        strokeWeight = "2"
                    />
                </GoogleMap>
            );
        }
        else {
            return (
                <GoogleMap
                    containerProps={{
                        style: {
                            height: 400,
                        },
                    }}
                    defaultZoom={this.props.zoom}
                    center={ mapCenter }
                    mapTypeId={ google.maps.MapTypeId.ROADMAP }
                />
            );
        }
    }
}

export default SimpleMap;
