import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import SummaryActivitiesContainer from '../containers/summaryActivitiesContainer';

export default class App extends Component {

    componentDidMount() {
        
        console.log("app.js::componentDidMount invoked");
    }
    
    render() {

        return (
            <MuiThemeProvider>
                <SummaryActivitiesContainer />
            </MuiThemeProvider>
        );
    }
}


