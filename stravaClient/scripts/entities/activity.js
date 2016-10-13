export default class Activity {
    constructor(activity = {}) {

        if (activity.hasOwnProperty("id")) {
            this.id = activity.id;
            this.athleteId = activity.athlete.id;
            this.averageSpeed = activity.average_speed;
            this.description = activity.description;                    // not present when retrieving summary activities from strava
            this.distance = activity.distance;
            this.elapsedTime = activity.elapsed_time;
            this.kilojoules = activity.kilojoules;
            this.city = activity.location_city;                         // deprecated in strava API
            if (activity.map.polyline) {
                this.mapPolyline = activity.map.polyline;
            }
            this.mapSummaryPolyline = activity.map.summary_polyline;
            this.maxSpeed = activity.max_speed;
            this.movingTime = activity.moving_time;
            this.name = activity.name;
            this.startDateLocal = new Date(activity.start_date_local);
            this.totalElevationGain = activity.total_elevation_gain;
            this.segmentEffortIds = [];                                 // not present when retrieving summary activities from strava
        }
    }
}
