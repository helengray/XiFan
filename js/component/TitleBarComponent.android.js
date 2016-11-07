import React,{Component} from 'react';
import {
	ToolbarAndroid,
	DeviceEventEmitter,
	StyleSheet,
	ToastAndroid,
	Text,
	TouchableOpacity,
}from 'react-native';
import AllScene from '../AllScene';

export default class TitleBarComponent extends Component{
	constructor(props){
		super(props);
	}

	//初始化props
	static defaultProps = {
		title:'',//标题
		subtitle:'',//副标题
		subScene:true,//是否是子页面
		hasMore:false,
	};

	static propTypes = {
		title:React.PropTypes.string,
		subtitle:React.PropTypes.string,
		subScene:React.PropTypes.bool,
		hasMore:React.PropTypes.bool,
		onActionSelected:React.PropTypes.func,
	};

	render() {
		var actions = this.props.hasMore?toolbarActions:[];
		return(
			<ToolbarAndroid 
				title={this.props.title}
				navIcon={this.props.subScene?require('../../img/ic_actionbar_back.png'):null}
				titleColor='white'
				subtitle={this.props.subtitle}
				subtitleColor='#ebf0f6'
				actions={actions}
				onActionSelected={this._onActionClick.bind(this)}
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
		if(this.props.onActionSelected){
			this.props.onActionSelected(index);
		}
		/*switch(index){
			case 0:
				var navigator = this.props.navigator;
				if(navigator){
					navigator.push({
						id:'AllScene',
						data:'',
						name:'全部',
						component:AllScene
					});
				}
				break;
			default:break;
		}*/
//ToastAndroid.show('index = '+index,ToastAndroid.LONG);
	}

}
const styles = StyleSheet.create({
	toolbar:{
		height:56,
		backgroundColor:'#ff5722',
	},
});
const toolbarActions = [
	{title:'全部',show:'always',icon:require('../../img/icon_all.png'),showWithText:true}
];