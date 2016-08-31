import React,{Component} from 'react';
import {
	View,
	Text,
	DeviceEventEmitter,
	Platform,
	StyleSheet,
	ViewPagerAndroid,
	TouchableOpacity,
	Navigator,
	BackAndroid,
} from 'react-native';
import TitleBar from './component/TitleBarComponent'
import DramaComponent from './component/DramaComponent'

//首页
export default class HomeScene extends Component{

	constructor(props){
		super(props);
		this.state = {
		  tabIndex:0,
		};
	}

	/*componentDidMount(){
		this._addBackAndroidListener(this.props.navigator);
	}

	componentWillUnmount(){
		this._removeBackAndroidListener();
	}

	//监听Android返回键
	_addBackAndroidListener(navigator){
		if(Platform.OS==='android'){
			BackAndroid.addEventListener('hardwareBackPress',()=>{
      			if(!navigator){return false;}
      			const routers = navigator.getCurrentRoutes();
      			if(routers.length == 1){
      				return false;
      			}else{
      				navigator.pop();
      				return true;
      			}
    		});
		}
	}
	//移除监听
	_removeBackAndroidListener(){
		if (Platform.OS === 'android') {
	      BackAndroid.removeEventListener('hardwareBackPress');  
	    }  
	}*/


	render(){
		return(
			<View style={{flex:1}} key='HomeScene'>
				<TitleBar title='首页' subtitle='看韩剧,上稀饭' subScene={false} navigator={this.props.navigator} hasMore={false}/>
				<View style={{height:35,flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'#ff5722'}}>
					<View style={{flex:1}}>
						<TouchableOpacity style={{flex:1,justifyContent:'center'}} activeOpacity={0.6} onPress={this._onTabPress.bind(this,0)}>
							<Text style={this.state.tabIndex===0?styles.TabSelect:styles.TabUnSelect}>最新</Text>
						</TouchableOpacity>
							<View style={this.state.tabIndex===0?styles.TabUnderlineSelect:styles.TabUnderlineUnSelect}/>
					</View>
					<View style={{flex:1}}>
						<TouchableOpacity style={{flex:1,justifyContent:'center'}} activeOpacity={0.6} onPress={this._onTabPress.bind(this,1)}>
							<Text style={this.state.tabIndex===0?styles.TabUnSelect:styles.TabSelect}>最热</Text>
						</TouchableOpacity>
							<View style={this.state.tabIndex===0?styles.TabUnderlineUnSelect:styles.TabUnderlineSelect}/>
					</View>
				</View>
				<ViewPagerAndroid 
					style={{flex:1}} 
					initialPage={0} 
					onPageSelected={this._onPageSelected.bind(this)}
					scrollEnabled={true}
					pageMargin={0}
					onPageScrollStateChanged={this._onPageScrollStateChanged}
					keyboardDismissMode='on-drag'
					ref={(viewPager)=>{this.viewPager = viewPager}}
				>
					<View style={{flex:1}}>
						<DramaComponent url='/hanju/new/' navigator={this.props.navigator}/>
					</View>
					<View style={{flex:1}}>
						<DramaComponent url='/hanju/renqi/' navigator={this.props.navigator}/>
					</View>
				</ViewPagerAndroid>
			</View>
			);
	}

	_onPageSelected(event){
		const position = event.nativeEvent.position;
		this.setState({
			tabIndex:position,
		});
	}

	_onPageScrollStateChanged(status){
		//idle 空闲，意味着当前没有交互。

		//dragging 拖动中，意味着当前页面正在被拖动。

		//settling 处理中，意味着当前页面发生过交互，且正在结束开头或收尾的动画。
	}

	//tab切换
	_onTabPress(index){
		this.viewPager.setPage(index);
		this.setState({
			tabIndex:index,
		});
	}
	
}

var styles = StyleSheet.create({
	TabSelect:{
		flex:1,
		textAlign:'center',
		color:'white',
	},
	TabUnderlineSelect:{
		backgroundColor:'white',
		height:2,
	},
	TabUnSelect:{
		flex:1,
		textAlign:'center',
		color:'#d5d5d5',
	},
	TabUnderlineUnSelect:{
		height:0,
	},
});