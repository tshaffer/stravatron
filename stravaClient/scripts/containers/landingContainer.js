import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import MysqlServices from '../services/mysqlServices';

import Landing from '../components/landing';

import { setSelectedAthlete } from '../actions/index';
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
        }, (err) => {
            console.log("initialization failure:", err);
        });
    }

    handleUpdateSelectedAthlete(athlete) {
        console.log("update athlete");
        this.props.setSelectedAthlete();
    }

    render() {

        return (
            <div>
                <Landing
                    athletes={this.props.athletes}
                    onUpdateSelectedAthlete={this.handleUpdateSelectedAthlete.bind(this)}
                />
            </div>
        );
    }
}

function mapStateToProps (state) {
    return {
        db: state.db,
        athletes: state.athletes
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({setDB, loadAthletes, loadMaps, setSelectedAthlete},
        dispatch);
}

LandingContainer.propTypes = {
    db: React.PropTypes.object.isRequired,
    athletes: React.PropTypes.array.isRequired,
    setSelectedAthlete: React.PropTypes.func.isRequired
};


export default connect(mapStateToProps, mapDispatchToProps)(LandingContainer);
