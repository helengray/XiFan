import React, { Component } from 'react';
import {
  AppRegistry,
  View,
  Text,
  
} from 'react-native';

export default class MyScene extends Component{
	render(){
		return(
			<View style={{flex:1,backgroundColor:'red'}}>
				<Text>我的页面</Text>
			</View>
			);
	}
}