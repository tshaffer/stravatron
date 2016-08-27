import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import { loadSummaryActivities } from '../actions/index';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            foo: null
        };
    }


    componentDidMount() {
        
        console.log("app.js::componentDidMount invoked");

        this.props.loadSummaryActivities();
    }


    render() {

        // let athleteId = "unknown athlete";
        // if (this.props.summaryActivities && this.props.summaryActivities.length > 0) {
        //     debugger;
        //     athleteId = this.props.summaryActivities[0].athlete.id.toString();
        // }

        return (
            <MuiThemeProvider>
                <div>
                    pizza
                    number of summary activities is: {Object.keys(this.props.summaryActivities.summaryActivitiesById).length}
                </div>
            </MuiThemeProvider>
        );
    }
}

function mapStateToProps (state) {
    return {
        summaryActivities: state.summaryActivities
    };
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({loadSummaryActivities},
        dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

