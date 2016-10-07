export default class Activity {
    constructor(activity = {}) {

        if (activity.hasOwnProperty("id")) {
            this.id = activity.id;
            this.athleteId = activity.athlete.id;
            this.averageSpeed = activity.average_speed;
            this.distance = activity.distance;
            this.elapsedTime = activity.elapsed_time;
            this.elevationHigh = activity.elev_high;
            this.elevationLow = activity.elev_low;
            this.endLatitudeLongitude = activity.end_latlng;
            this.kilojoules = activity.kilojoules;
            this.city = activity.location_city;
            this.mapSummaryPolyline = activity.map.summary_polyline;
            this.maxSpeed = activity.max_speed;
            this.movingTime = activity.moving_time;
            this.name = activity.name;
            this.startDate = activity.start_date;
            this.startDateLocal = activity.start_date_local;
            this.startLatitude = activity.start_latitude;
            this.startLongitude = activity.start_longitude;
            this.timezone = activity.timezone;
            this.totalElevationGain = activity.total_elevation_gain;
            this.totalPhotoCount = activity.total_photo_count;
            this.segmentEffortIds = [];
        }
    }
}
