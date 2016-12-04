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

  addMapMarker(sourceName, coordinates, color) {

    this.markerPoint = {
      "type": "Point",
      "coordinates": coordinates
    };

    this.activityMap.addSource(sourceName, {type: 'geojson', data: this.markerPoint});

    this.activityMap.addLayer({
      "id": sourceName,
      "type": "circle",
      "source": sourceName,
      "paint": {
        "circle-radius": 8,
        "circle-color": color,
        "circle-opacity": 0.8
      }
    });
  }
  createMapMarker() {

    const locations = this.props.activityLocations;

    // one marker => elevation chart
    if (this.props.markerCount === 1) {
      this.addMapMarker("marker0", locations[0], "red");
    }
    // two markers => create segment
    else if (this.props.markerCount === 2) {

      let location0Index = Math.floor(locations.length / 3);
      let location1Index = location0Index * 2;
      let mapMarker0Coordinates = locations[location0Index];
      let mapMarker1Coordinates = locations[location1Index];

      this.addMapMarker("marker0", mapMarker0Coordinates, "green");
      this.addMapMarker("marker1", mapMarker1Coordinates, "red");
    }
  }

  updateMapMarkers() {

    // one marker => elevation chart
    if (this.props.markerCount === 1) {
      const elevationChartLocation = this.props.locationCoordinates.locationsByUIElement["elevationChart"];
      if (elevationChartLocation) {
        const elevationChartCoordinates = this.props.locationCoordinates.locationsByUIElement["elevationChart"].coordinates;
        if (elevationChartCoordinates) {
          let sourceName = "marker0";
          const source = this.activityMap.getSource(sourceName);
          if (source) {
            this.markerPoint.coordinates = elevationChartCoordinates;
            source.setData(this.markerPoint);
          }
        }
      }
    }
    // two markers => create segment
    else if (this.props.markerCount === 2) {
      const segmentCreationStartLocation = this.props.locationCoordinates.locationsByUIElement["segmentCreationStart"];
      if (segmentCreationStartLocation) {
        const segmentCreationStartCoordinates = this.props.locationCoordinates.locationsByUIElement["segmentCreationStart"].coordinates;
        if (segmentCreationStartCoordinates) {
          let sourceName = "marker0";
          const source = this.activityMap.getSource(sourceName);
          if (source) {
            this.markerPoint.coordinates = segmentCreationStartCoordinates;
            source.setData(this.markerPoint);
          }
        }
      }
      const segmentCreationEndLocation = this.props.locationCoordinates.locationsByUIElement["segmentCreationEnd"];
      if (segmentCreationEndLocation) {
        const segmentCreationEndCoordinates = this.props.locationCoordinates.locationsByUIElement["segmentCreationEnd"].coordinates;
        if (segmentCreationEndCoordinates) {
          let sourceName = "marker1";
          const source = this.activityMap.getSource(sourceName);
          if (source) {
            this.markerPoint.coordinates = segmentCreationEndCoordinates;
            source.setData(this.markerPoint);
          }
        }
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

    if (this.activityMap && this.mapBoxMap) {
      this.updateMapMarkers();
    }

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
  // segmentEndPoint: React.PropTypes.array.isRequired,
  activityLocations: React.PropTypes.array.isRequired,

  locationCoordinates: React.PropTypes.object.isRequired
};


export default ActivityMap;



