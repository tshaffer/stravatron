export default class SegmentEffort {
    constructor(segmentEffort) {

        this.id = segmentEffort.id;
        this.activityId = segmentEffort.activity.id;
        this.athleteId = segmentEffort.athlete.id;
        this.distance = segmentEffort.distance;
        this.elapsedTime = segmentEffort.elapsed_time;
        this.endIndex = segmentEffort.end_index;
        this.movingTime = segmentEffort.moving_time;
        this.name = segmentEffort.name;
        this.prRank = segmentEffort.pr_rank;
        this.segmentId = segmentEffort.segment.id;
        this.startDate = segmentEffort.start_date;
        this.startDateLocal = segmentEffort.start_date_local;
        this.startIndex = segmentEffort.start_index;
        this.startLatitude = segmentEffort.start_latitude;
        this.startLongitude = segmentEffort.start_longitude;
        this.timezone = segmentEffort.timezone;
        this.totalElevationGain = segmentEffort.total_elevation_gain;
        this.totalPhotoCount = segmentEffort.total_photo_count;
    }
}
