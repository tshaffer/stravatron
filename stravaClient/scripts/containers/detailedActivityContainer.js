// import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
//
// import { hashHistory } from 'react-router';
//
// import { loadDetailedActivity } from '../actions/index';
//
// import { getActivity } from '../reducers/reducer_activities';
// import { getSegmentEffortsForActivity} from '../reducers/reducer_segment_efforts';
//
// import DetailedActivity from '../components/detailedActivity';
//
// class DetailedActivityContainer extends Component {
//
//     constructor(props) {
//         super(props);
//
//         this.state = {
//             chartLocation: [],
//             activityId: ""
//         };
//     }
//
//     componentWillMount() {
//
//         if (Object.keys(this.props.activities.activitiesById).length == 0) {
//             hashHistory.push('/');
//             return;
//         }
//
//         const activityId = this.props.params.id;
//         this.setState({activityId: activityId});
//
//         this.props.loadDetailedActivity(activityId);
//     }
//
//     render() {
//         return (
//             <div>
//                 <DetailedActivity
//                     activity={this.props.activity}
//                     segments={this.props.segments}
//                     segmentEfforts={this.props.segmentEfforts}
//                     effortsForSegments={this.props.effortsForSegments}
//                     segmentEffortsForActivity={this.props.segmentEffortsForActivity}
//                 />
//             </div>
//         );
//     }
// }
//
// function mapStateToProps (state, ownProps) {
//     return {
//         activity: getActivity(state, ownProps.params.id),
//         activities: state.activities,
//         segments: state.segments,
//         segmentEfforts: state.segmentEfforts,
//         effortsForSegments: state.effortsForSegments,
//         segmentEffortsForActivity: getSegmentEffortsForActivity(state, ownProps.params.id)
//     };
// }
//
// function mapDispatchToProps(dispatch) {
//     return bindActionCreators({loadDetailedActivity},
//         dispatch);
// }
//
// DetailedActivityContainer.propTypes = {
//     activity: React.PropTypes.object.isRequired,
//     activities: React.PropTypes.object.isRequired,
//     params: React.PropTypes.object.isRequired,
//     loadDetailedActivity: React.PropTypes.func.isRequired,
//     segments: React.PropTypes.object.isRequired,
//     segmentEfforts: React.PropTypes.object.isRequired,
//     effortsForSegments: React.PropTypes.object.isRequired,
//     segmentEffortsForActivity: React.PropTypes.array.isRequired
//
// };
//
// export default connect(mapStateToProps, mapDispatchToProps)(DetailedActivityContainer);

import { connect } from 'react-redux';

import DetailedActivity from '../components/detailedActivity';

import { loadDetailedActivity } from '../actions/index';
import { getActivity } from '../reducers/reducer_activities';
import { getSegmentEffortsForActivity} from '../reducers/reducer_segment_efforts';

function mapStateToProps (state, ownProps) {
    return {
        activity: getActivity(state, ownProps.params.id),
        activities: state.activities,
        segments: state.segments,
        segmentEfforts: state.segmentEfforts,
        effortsForSegments: state.effortsForSegments,
        segmentEffortsForActivity: getSegmentEffortsForActivity(state, ownProps.params.id)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onLoadDetailedActivity: (activityId) => {
            dispatch(loadDetailedActivity(activityId));
        }
    };
}

const DetailedActivityContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(DetailedActivity);

export default DetailedActivityContainer;