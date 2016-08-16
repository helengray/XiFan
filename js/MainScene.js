import React,{Component} from 'react';
import {
	View,
	Text,
	DeviceEventEmitter,
	BackAndroid,
	Platform,
	StyleSheet,
	ViewPagerAndroid,
	TouchableOpacity,
} from 'react-native';
import TitleBar from './component/TitleBarComponent'
import DramaComponent from './component/DramaComponent'
//首页
export default class MainScene extends Component{

	constructor(props){
		super(props);
		this.state = {
		  url:'/hanju/new/',
		  tabIndex:0,
		};
	}

	componentDidMount(){
		this.subscription = DeviceEventEmitter.addListener('dataChange',this._onListenerCallback.bind(this));
		this._addBackAndroidListener(this.props.navigator);
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

	componentWillUnmount(){
		this.subscription.remove();
		this._removeBackAndroidListener();
	}

	_removeBackAndroidListener(){
		if (Platform.OS === 'android') {
	      BackAndroid.removeEventListener('hardwareBackPress');  
	    }  
	}


	_onListenerCallback(params){
		//console.log('params = '+ params);
		this.setState({
		  url:params,
		});
	};

	render(){
		return(
			<View style={{flex:1}}>
				<TitleBar title='首页' subtitle='看韩剧,上稀饭' subScene={false}/>
				<View style={{height:35,flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'#f74c31'}}>
					<View style={{flex:1}}>
						<TouchableOpacity style={{flex:1,}} activeOpacity={0.6} onPress={this._newestTextPress.bind(this)}>
							<Text style={this.state.tabIndex===0?styles.TabSelect:styles.TabUnSelect}>最新</Text>
						</TouchableOpacity>
							<View style={this.state.tabIndex===0?styles.TabUnderlineSelect:styles.TabUnderlineUnSelect}/>
					</View>
					<View style={{flex:1}}>
						<TouchableOpacity style={{flex:1}} activeOpacity={0.6} onPress={this._hotTextPress.bind(this)}>
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
					ref={viewPager=>{this.viewPager = viewPager}}
				>
					<View>
						<DramaComponent url='/hanju/new/' navigator={this.props.navigator}/>
					</View>
					<View>
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
	//最新
	_newestTextPress(){
		this.viewPager.setPage(0);
		this.setState({
			tabIndex:0,
		});
	}
	//最热
	_hotTextPress(){
		//this.viewPager.setPageWithoutAnimation(1);
		this.viewPager.setPage(1);
		this.setState({
			tabIndex:1,
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