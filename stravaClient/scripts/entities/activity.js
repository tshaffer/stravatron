export default class Activity {
    constructor(stravaActivity = {}) {

        if (stravaActivity.hasOwnProperty("id")) {
            this.id = stravaActivity.id;
            this.athleteId = stravaActivity.athlete.id;
            this.averageSpeed = stravaActivity.average_speed;
            this.description = stravaActivity.description;                      // not present when retrieving summary activities from strava
            this.distance = stravaActivity.distance;
            this.elapsedTime = stravaActivity.elapsed_time;
            this.kilojoules = stravaActivity.kilojoules;
            this.city = stravaActivity.location_city;                           // deprecated in strava API
            if (stravaActivity.map.polyline) {
                this.mapPolyline = stravaActivity.map.polyline;
            }
            this.mapSummaryPolyline = stravaActivity.map.summary_polyline;
            this.maxSpeed = stravaActivity.max_speed;
            this.movingTime = stravaActivity.moving_time;
            this.name = stravaActivity.name;
            this.startDateLocal = new Date(stravaActivity.start_date_local);
            this.totalElevationGain = stravaActivity.total_elevation_gain;
        }
    }
}
