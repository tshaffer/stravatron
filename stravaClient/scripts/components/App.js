import React from 'react';
import {Component} from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme';

export default class App extends Component {

    componentDidMount() {
        console.log("app.js::componentDidMount invoked");
    }

    render() {

        return (
            <MuiThemeProvider>
                <div>
                    pizza
                </div>
            </MuiThemeProvider>
        );
    }
}
