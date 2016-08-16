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

import MainScene from './js/MainScene'

class XiFan extends Component {

  render(){
    return(
      <Navigator 
        initialRoute={{url:'',name:'',component:MainScene}}
        renderScene={(route,navigator)=>{
          let Scene = route.component;
          return <Scene url = {route.url} name={route.name} navigator={navigator}/>
        }}
        configureScene={(route) => {
          if(route.sceneConfig){
            return route.sceneConfig;
          }
          return Navigator.SceneConfigs.HorizontalSwipeJump;
        }}
      />
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
