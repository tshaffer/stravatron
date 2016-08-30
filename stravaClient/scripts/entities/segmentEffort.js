export default class SegmentEffort {
    constructor(segmentEffort) {

        this.id = segmentEffort.id;
        this.activityId = segmentEffort.activity.id;
        this.athleteId = segmentEffort.athlete.id;
        this.distance = segmentEffort.distance;
        this.endIndex = segmentEffort.end_index;
        this.movingTime = segmentEffort.moving_time;
        this.name = segmentEffort.name;
        this.segmentId = segmentEffort.segment.id;
        this.startDateLocal = segmentEffort.start_date_local;
        this.startIndex = segmentEffort.start_index;
    }
}
