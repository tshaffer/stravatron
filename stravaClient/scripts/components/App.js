import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import SummaryActivities from '../containers/summaryActivities';

export default class App extends Component {

    componentDidMount() {
        
        console.log("app.js::componentDidMount invoked");
    }
    
    render() {

        return (
            <MuiThemeProvider>
                <SummaryActivities />
            </MuiThemeProvider>
        );
    }
}


