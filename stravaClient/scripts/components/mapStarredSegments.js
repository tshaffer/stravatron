import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { listStarredSegments } from '../actions/index';

class MapStarredSegments extends Component {

    componentWillMount() {

        console.log("mapStarredSegments componentWillMount invoked");

        this.props.listStarredSegments();
    }

    render() {
        return <div>poo</div>;
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({listStarredSegments},
        dispatch);
}

export default connect(null, mapDispatchToProps)(MapStarredSegments);

