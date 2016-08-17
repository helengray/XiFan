/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Navigator,
  
} from 'react-native';

import MainScene from './js/MainScene';
import AppNavigator from './js/component/AppNavigator';

class XiFan extends Component {

  render(){
    return(
      <AppNavigator id='main' url='' name='' component={MainScene}/>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});

AppRegistry.registerComponent('XiFan', () => XiFan);
