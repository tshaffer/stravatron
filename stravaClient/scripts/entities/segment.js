export default class Segment {
    constructor(segment) {

        this.id = segment.id;
        this.averageGrade = segment.average_grade;
        this.distance = segment.distance;
        this.elevationHigh = segment.elev_high;
        this.elevationLow = segment.elev_low;
        this.endLatitudeLongitude = segment.end_latlng;
        this.name = segment.name;
        this.startLatitude = segment.start_latitude;
        this.startLongitude = segment.start_longitude;
        this.startDate = segment.start_date;
        this.startDateLocal = segment.start_date_local;
        this.startIndex = segment.start_index;
    }
}
