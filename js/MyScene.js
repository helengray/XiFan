import React, { Component } from 'react';
import {
  AppRegistry,
  View,
  Text,
  
} from 'react-native';
import TitleBar from './component/TitleBarComponent';
export default class MyScene extends Component{
	render(){
		return(
			<View style={{flex:1}}>
                <TitleBar title="我的" subScene={false}/>
				<Text>我的页面</Text>
			</View>
			);
	}
}