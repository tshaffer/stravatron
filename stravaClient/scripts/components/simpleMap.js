import { default as React, Component } from "react";

import { GoogleMap } from "react-google-maps";

class SimpleMap extends Component {
    render() {
        /*
         * 2. Render GoogleMap component with containerProps
         */
        // height: `100%`,
        // defaultCenter={{ lat: -34.397, lng: 150.644 }}
        // defaultCenter={{ lat: {lat}, lng: {longitude} }}
        // defaultCenter={{ lat: 37.39, lng: -122.17 }}

        const lat = this.props.startLatitude;
        const longitude = this.props.startLongitude;

        return (
            <GoogleMap
                containerProps={{
                    style: {
                        height: 400,
                    },
                }}
                /*
                 * 3. config <GoogleMap> instance by properties
                 */
                defaultZoom={8}
                defaultCenter={
                    { lat: 37.39, lng: -122.17 }
                }
            />
        );
    }
}

export default SimpleMap;
