import { default as React, Component } from "react";

import { GoogleMap, Polyline } from "react-google-maps";

class SimpleMap extends Component {

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

            var bounds = new google.maps.LatLngBounds();
            ridePathDecoded.forEach( (location) => {
                bounds.extend(location);
            });

            bounds={ bounds };

            // <Marker
            //     position= { mapCenter }
            // />
            // strokeColor = "#FF0000"
            // strokeColor = {"#FF0000"}

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
