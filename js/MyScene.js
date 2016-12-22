import React, { Component } from 'react';
import {
	View,
	Text,
	Image,
	StyleSheet,
	TouchableOpacity
} from 'react-native';
import MyCollectionScene from './MyCollectionScene';
import ViewsHistoryScene from './ViewsHistoryScene';
import BaseTitleBarScene from './component/BaseTitleBarScene';

export default class MyScene extends BaseTitleBarScene{

	static defaultProps = {
        titleText:"我的",
        showLeftButton:false,
	};

	_onPress(index){
		var component;
		switch (index){
			case 0:
				component = {
					id:'MyCollectionScene',
                    titleText:'我的收藏',
					component:MyCollectionScene
				};
				break;
			case 1:
				component = {
					id:'ViewsHistoryScene',
                    titleText:'观看历史',
					component:ViewsHistoryScene
				};
				break;
		}
		const navigator = this.props.navigator;
		if(navigator){
			navigator.push(component);
		}
	}

	renderContent(){
		return(
			<View>
				<TouchableOpacity activeOpacity={0.6} onPress={this._onPress.bind(this,0)}>
					<View style={styles.item}>
						<Image style={styles.image} source={require('../img/icon_collection.png')}/>
						<Text style={styles.text}>我的收藏</Text>
					</View>
				</TouchableOpacity>
				<View style={styles.divider}/>
				<TouchableOpacity activeOpacity={0.6} onPress={this._onPress.bind(this,1)}>
					<View style={[styles.item,{marginTop:1}]}>
						<Image style={styles.image} source={require('../img/icon_view_history.png')}/>
						<Text style={styles.text}>观看历史</Text>
					</View>
				</TouchableOpacity>
			</View>
			);
    }
}

const styles = StyleSheet.create({
	item:{
		height:50,
		flexDirection:'row',
		paddingLeft:12,
		paddingRight:12,
		backgroundColor:'white',
		alignItems:'center',
	},
	image:{
		height:30,
		width:30
	},
	text:{
		fontSize:14,
		color:'black',
		textAlign:'center',
		marginLeft:12,
	},
	divider:{
		height:1,
		backgroundColor:'#ddd'
	}
});