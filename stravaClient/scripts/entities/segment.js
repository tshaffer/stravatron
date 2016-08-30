export default class Segment {
    constructor(segment) {

        this.id = segment.id;
        this.averageGrade = segment.average_grade;
        this.distance = segment.distance;
        this.endLatitudeLongitude = segment.end_latlng;
        this.name = segment.name;
        this.starred = segment.starred;
        this.startLatitudeLongitude = segment.start_latlng;

        this.createdAt = null;
        this.totalElevationGain = null;
        this.map = null;
        this.effortCount = null;
    }
}
