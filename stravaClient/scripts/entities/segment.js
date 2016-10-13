export default class Segment {
    constructor(segment) {

        this.id = segment.id;
        this.averageGrade = segment.average_grade;
        this.distance = segment.distance;
        this.name = segment.name;
        this.starred = segment.starred;

        this.totalElevationGain = null;
        this.mapPolyline = null;
    }
}
