import React,{Component} from 'react';
import {
	View,
	Text,
	StyleSheet,
	Image,
	RefreshControl,
	Dimensions,
	TouchableOpacity,
} from 'react-native';
import TitleBar from './TitleBarComponent'
export default class DramaDetailComponent extends Component{
	constructor(props){
		super(props);
	}

	render(){
		return(
			<View stytle={{flex:1}}>
				<TitleBar title={this.props.name} subtitle='' subScene={true} navigator={this.props.navigator}/>
				<Text>详情页</Text>
			</View>
			);
	}
}