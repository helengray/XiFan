import React,{Component} from 'react';
import {
	ToolbarAndroid,
	DeviceEventEmitter,
	StyleSheet,
	ToastAndroid,
	Text,
	TouchableOpacity,
}from 'react-native';

export default class TitleBarComponent extends Component{
	constructor(props){
		props.subScene = {true};
		super(props);
	}

	//初始化props
	static defaultProps = {
		title:'',
		subtitle:'',
		subScene:true,
	};

	render() {
		return(
			<ToolbarAndroid 
				title={this.props.title}
				navIcon={this.props.subScene?require('../../img/ic_actionbar_back.png'):null}
				titleColor='white'
				subtitle={this.props.subtitle}
				subtitleColor='#ebf0f6'
				onActionSelected={this._onActionClick}
				
				onIconClicked={this._onIconClick.bind(this)}
				style={styles.toolbar}
			/>
			);
	}
//actions={this.props.subScene?null:toolbarActions}
	//返回按钮事件
	_onIconClick(){
		var navigator = this.props.navigator;
		if(navigator){
			navigator.pop();
		}
	}

	_onActionClick(index){
		switch(index){
			case 0:
				DeviceEventEmitter.emit('dataChange','/hanju/new/');
				break;
			case 1:
				DeviceEventEmitter.emit('dataChange','/hanju/renqi/');
				break;
			default:break;
		}
//ToastAndroid.show('index = '+index,ToastAndroid.LONG);
	}

}
const styles = StyleSheet.create({
	toolbar:{
		height:56,
		backgroundColor:'#f74c31',
	},
});
const toolbarActions = [
	{title:'最新',show:'always',icon:require('../../img/icon_newest.png'),showWithText:true},
	{title:'最热',show:'always',icon:require('../../img/icon_hot.png'),showWithText:true}
];