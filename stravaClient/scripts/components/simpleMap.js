import { default as React, Component } from "react";

import { GoogleMap } from "react-google-maps";

class SimpleMap extends Component {
    render() {
        /*
         * 2. Render GoogleMap component with containerProps
         */
        // height: `100%`,

        const mapCenter = {
            lat: this.props.startLatitude,
            lng: this.props.startLongitude
        };

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
                defaultZoom={this.props.zoom}
                defaultCenter={ mapCenter }
            />
        );
    }
}

export default SimpleMap;
