import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { hashHistory } from 'react-router';

import MysqlServices from '../services/mysqlServices';

import Landing from '../components/landing';

import { setSelectedAthlete } from '../actions/index';
import { setDB, loadAthletes, loadMaps } from '../actions/dbActions';

import { objectPopulated, arrayPopulated } from '../utilities/utils';

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

    handleUpdateSelectedAthlete(selectedAthleteName) {
        console.log("update athleteName:", selectedAthleteName);

        this.props.athletes.forEach( athlete => {
            if (athlete.name == selectedAthleteName) {
                this.props.setSelectedAthlete(athlete);
            }
        });
    }

    handleShowSummaryActivities() {
        console.log("fum");
        hashHistory.push('/summaryActivitiesContainer');
    }

    render() {

        let selectedAthlete = {};

        if (objectPopulated(this.props.selectedAthlete)) {
            selectedAthlete = this.props.selectedAthlete;
        }
        else if (arrayPopulated(this.props.athletes)) {
            selectedAthlete = this.props.athletes[0];
        }

        return (
            <div>
                <Landing
                    athletes={this.props.athletes}
                    selectedAthlete={selectedAthlete}
                    onUpdateSelectedAthlete={this.handleUpdateSelectedAthlete.bind(this)}
                    onShowSummaryActivities={this.handleShowSummaryActivities.bind(this)}
                />
            </div>
        );
    }
}

function mapStateToProps (state) {
    return {
        db: state.db,
        athletes: state.athletes,
        selectedAthlete: state.selectedAthlete
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({setDB, loadAthletes, loadMaps, setSelectedAthlete},
        dispatch);
}

LandingContainer.propTypes = {
    db: React.PropTypes.object.isRequired,
    athletes: React.PropTypes.array.isRequired,
    setSelectedAthlete: React.PropTypes.func.isRequired,
    selectedAthlete: React.PropTypes.object.isRequired
};

// LandingContainer.defaultProps = {
//     reviews: []
// }

export default connect(mapStateToProps, mapDispatchToProps)(LandingContainer);
