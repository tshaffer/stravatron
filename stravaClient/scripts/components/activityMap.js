import React, { Component } from 'react';
import { Link } from 'react-router';

class ActivityMap extends Component {

  constructor(props) {
    super(props);

    this.activityMap = null;
  }

  initializeMap() {

    let self = this;

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

    window.mapboxgl.accessToken =
      'pk.eyJ1IjoidGVkc2hhZmZlciIsImEiOiJjaXN2cjR4dXIwMjgwMm9wZ282cmk0aTgzIn0.9EtSUOr_ofLcwCDLM6FUHw';
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

// polylines for activities
//       let activityCoordinates = [];
      for (let segmentIndex = 0; segmentIndex < self.props.activitiesData.length; segmentIndex++) {

        let sourceName = "segment" + segmentIndex.toString();
        let lineLayerName = "points" + segmentIndex.toString();

        const segmentData = self.props.activitiesData[segmentIndex];

        self.addLineToMap(sourceName, "segment" + segmentIndex.toString(),
          lineLayerName, segmentData.polyline, segmentData.strokeColor);
      }

      if (self.props.markerCount > 0) {
        self.createMapMarker();
      }

// create a GeoJSON point to serve as a starting point
//       if (self.props.markerCount > 0) {
//         let coordinates = [longitudeCenter, latitudeCenter];
//         if (self.props.mapLatitudeLongitude && self.props.mapLatitudeLongitude.length > 0) {
//           coordinates = self.props.mapLatitudeLongitude;
//         }
//         coordinates = activityCoordinates[0];
//
//         self.markerPoint = {
//           "type": "Point",
//           "coordinates": coordinates
//         };
//         self.activityMap.addSource('markerLocation', { type: 'geojson', data: self.markerPoint });
//
//         self.activityMap.addLayer({
//           "id": "markerCircle",
//           "type": "circle",
//           "source": "markerLocation",
//           "paint": {
//             "circle-radius": 8,
//             "circle-color": "red",
//             "circle-opacity": 0.8
//           }
//         });
//       }

      // if (self.props.markerCount > 1) {
      //   let coordinates = [longitudeCenter, latitudeCenter];
      //   if (self.props.mapLatitudeLongitude && self.props.mapLatitudeLongitude.length > 0) {
      //     coordinates = self.props.mapLatitudeLongitude;
      //   }
      //   coordinates = self.props.activityLocations[Math.round(self.props.activityLocations.length / 2) - 1];
      //
      //   self.endMarkerPoint = {
      //     "type": "Point",
      //     "coordinates": coordinates
      //   };
      //   self.activityMap.addSource('endMarkerLocation', { type: 'geojson', data: self.endMarkerPoint });
      //
      //   self.activityMap.addLayer({
      //     "id": "endMarkerCircle",
      //     "type": "circle",
      //     "source": "endMarkerLocation",
      //     "paint": {
      //       "circle-radius": 8,
      //       "circle-color": "green",
      //       "circle-opacity": 0.8
      //     }
      //   });
      // }
    });
  }

  addLineToMap(sourceName, sourceTitle, layerName, pathToDecode, color) {

    let coordinates = [];

    let ridePathDecoded = window.google.maps.geometry.encoding.decodePath(pathToDecode);
    ridePathDecoded.forEach((location) => {
      let longitude = location.lng();
      let latitude = location.lat();
      let lngLat = [longitude, latitude];
      coordinates.push(lngLat);
    });

    this.activityMap.addSource(sourceName, {
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
            "title": sourceTitle
          }
        }]
      }
    });

    this.activityMap.addLayer({
      "id": layerName,
      "type": "line",
      "source": sourceName,
      "layout": {
        "line-join": "round",
        "line-cap": "round",
      },
      "paint": {
        "line-color": color,
        "line-width": 2
      }
    });

    return coordinates;
  }

  loadAndRenderMap() {

    if (this.activityMap) return;

    let allDataLoaded = true;
    if (this.props.activitiesData.length === this.props.totalActivities) {
      this.props.activitiesData.forEach( (activityData) => {
        if (activityData.polyline === "") {
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
        this.initializeMap();
      }
    }
  }

  createMapMarker() {

    const markersByActivity = this.props.mapMarkers.markersByActivity;
    for (let activityId in markersByActivity) {
      if (markersByActivity.hasOwnProperty(activityId)) {
        const markers = markersByActivity[activityId];

        markers.forEach( (marker, index) => {

          let sourceName = "";

          if (index === 0) {
            sourceName = "flibbet";
          }
          else {
            sourceName = "pooper";
          }

          let coordinates = marker.coordinates;
          console.log("createMapMarker");
          console.log(coordinates);

          this.markerPoint = {
            "type": "Point",
            "coordinates": coordinates
          };

          this.activityMap.addSource(sourceName, {type: 'geojson', data: this.markerPoint});

          // console.log("markerColor is: ", marker.color);

          this.activityMap.addLayer({
            // "id": "markerCircle",
            "id": sourceName,
            "type": "circle",
            "source": sourceName,
            "paint": {
              "circle-radius": 8,
              "circle-color": marker.color,
              "circle-opacity": 0.8
            }
          });
        });
      }
    }
  }

  updateMapMarkers() {

    const self = this;
    
    const markersByActivity = self.props.mapMarkers.markersByActivity;
    for (let activityId in markersByActivity) {
      if (markersByActivity.hasOwnProperty(activityId)) {
        const markers = markersByActivity[activityId];

        markers.forEach( (marker, index) => {

          let sourceName = "";

          if (index === 0) {
            sourceName = "flibbet";
          }
          else {
            sourceName = "pooper";
          }

          if (marker.coordinates[0] !== 0 && marker.coordinates[1] !== 0) {
            const source = self.activityMap.getSource(sourceName);
            if (source) {
              self.markerPoint.coordinates = marker.coordinates;

              console.log("updateMapMarkers");
              console.log(self.markerPoint.coordinates);

              source.setData(self.markerPoint);

              // console.log(source);
              // console.log(self.markerPoint);

              // debugger;
            }
          }
        });
      }
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

    let mapLegend = activitiesData.map((activityData) => {

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

    let self = this;

    // if (this.activityMap && this.props.markerCount > 0 && this.props.mapLatitudeLongitude
    //   && this.props.mapLatitudeLongitude.length > 0) {
    //   this.setMarkerPosition();
    // }
    // if (this.activityMap && this.props.markerCount > 1 && this.props.segmentEndPoint
    //   && this.props.segmentEndPoint.length > 0) {
    //   this.setSegmentEndPointPosition();
    // }

    // for (var property in object) {
    //   if (object.hasOwnProperty(property)) {
    //     // do stuff
    //   }
    // }

    // Object.keys(obj).length

    // if (Object.keys(this.props.mapMarkers.markersByActivity).length > 0) {
    if (this.activityMap && this.mapBoxMap) {
      this.updateMapMarkers();
    }
    // }

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
  markerCount: React.PropTypes.number.isRequired,
  mapLatitudeLongitude: React.PropTypes.array.isRequired,
  // segmentEndPoint: React.PropTypes.array.isRequired,
  // activityLocations: React.PropTypes.array.isRequired,
  mapMarkers: React.PropTypes.object.isRequired
};


export default ActivityMap;



