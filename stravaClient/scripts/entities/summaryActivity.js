export default class SummaryActivity {
    constructor(summaryActivity = {}) {

        if (summaryActivity.hasOwnProperty("id")) {
            this.id = summaryActivity.id;
            this.athleteId = summaryActivity.athlete.id;
            this.averageSpeed = summaryActivity.average_speed;
            this.distance = summaryActivity.distance;
            this.elapsedTime = summaryActivity.elapsed_time;
            this.elevationHigh = summaryActivity.elev_high;
            this.elevationLow = summaryActivity.elev_low;
            this.endLatitudeLongitude = summaryActivity.end_latlng;
            this.kilojoules = summaryActivity.kilojoules;
            this.city = summaryActivity.location_city;
            // map
            // summaryActivity.map.id
            // summaryActivity.map.summary_polyline
            this.maxSpeed = summaryActivity.max_speed;
            this.movingTime = summaryActivity.moving_time;
            this.name = summaryActivity.name;
            this.startDate = summaryActivity.start_date;
            this.startDateLocal = summaryActivity.start_date_local;
            this.startLatitude = summaryActivity.start_latitude;
            this.startLongitude = summaryActivity.start_longitude;
            this.timezone = summaryActivity.timezone;
            this.totalElevationGain = summaryActivity.total_elevation_gain;
            this.totalPhotoCount = summaryActivity.total_photo_count;
            this.segmentEffortIds = [];
        }
    }
}
