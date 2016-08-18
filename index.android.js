/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Navigator,
  
} from 'react-native';

//import MainScene from './js/MainScene';
import AppNavigator from './js/component/AppNavigator';
import HomeScene from './js/HomeScene';

class XiFan extends Component {

  render(){
    return(
      <AppNavigator id='HomeScene' data='' name='' component={HomeScene}/>
      );
  }
}


AppRegistry.registerComponent('XiFan', () => XiFan);
