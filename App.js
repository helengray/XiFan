import React, { Component } from 'react';

import MainScene from './js/MainScene';
import AppNavigator from './js/component/AppNavigator';

export default class App extends Component {

    render(){
        return(
            <AppNavigator id='MainScene' component={MainScene}/>
        );
    }
}