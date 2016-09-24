import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import MysqlServices from '../services/mysqlServices';

import SummaryActivitiesContainer from '../containers/summaryActivitiesContainer';

import { setDB, loadAthletes, loadMaps } from '../actions/dbActions';

class LandingContainer extends Component {

    constructor(props) {
        super(props);
        this.mysql = new MysqlServices();
    }

    componentWillMount() {
        var self = this;
        const promise = this.mysql.initialize();
        promise.then( db => {

            self.props.setDB(db);
            self.props.loadAthletes(self.mysql);

            // this.mysql.addAthlete("2843574", "fb8085cc4c7f3633533e875eae3dc1e04cef06e8", "Dad", "Ted", "Shaffer", "shaffer.family@gmail.com");
            // this.mysql.addAthlete("7085811", "29ef6b106ea16378e27f6031c60a79a4d445d489", "Mom", "Lori", "Shaffer", "loriashaffer@gmail.com");
            // this.mysql.addMap("Santa Cruz", "mapbox://styles/tedshaffer/citagbl4b000h2iqbkgub0t26");
        }, (err) => {
            console.log("initialization failure:", err);
        });
    }

    render() {
        return <div>Pizza</div>;
    }
}

function mapStateToProps (state) {
    return {
        db: state.db
        // athletes: state.athletes
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({setDB, loadAthletes, loadMaps},
        dispatch);
}

LandingContainer.propTypes = {
    db: React.PropTypes.object.isRequired
    // athletes: React.PropTypes.object.isRequired
};


export default connect(mapStateToProps, mapDispatchToProps)(LandingContainer);
