import React,{Component} from 'react';
import {
	View,
	Text,
	Navigator,
	Platform,
	StyleSheet,
	ViewPagerAndroid,
	TouchableOpacity,
	Image,
	BackAndroid,
	ToastAndroid,
} from 'react-native';
import HomeScene from './HomeScene'
import MyScene from './MyScene';
import SQLite from './db/SQLite';
var sqLite = new SQLite();
//首页
export default class MainScene extends Component{
	constructor(props){
		super(props);
		this.state={
			tabIndex:0,
		}

	}

	componentDidMount(){
		this._addBackAndroidListener(this.props.navigator);
		sqLite.createTable();
	}

	componentWillUnmount(){
		this._removeBackAndroidListener();
		sqLite.close();
	}

	//监听Android返回键
	_addBackAndroidListener(navigator){
		if(Platform.OS==='android'){
			var currTime = 0;
			BackAndroid.addEventListener('hardwareBackPress',()=>{
      			if(!navigator){return false;}
      			const routers = navigator.getCurrentRoutes();
      			if(routers.length == 1){
      				var nowTime = (new Date()).valueOf();
                    if(nowTime - currTime > 2000){
                        currTime = nowTime;
                        ToastAndroid.show("再按一次退出程序",ToastAndroid.SHORT);
                        return true;
                    }
      				return false;
      			}else{//在其他子页面
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
	}

	renderScene(router, navigator){
		this.nav = navigator;
		if(router.name == 'HomeScene'){
			return <HomeScene navigator={this.props.navigator}/>;
		}else {
			return <MyScene navigator={this.props.navigator}/>;
		}
	}

	render(){
		// <ViewPagerAndroid
				// 	style={{flex:1}}
				// 	initialPage={0}
				// 	scrollEnabled={false}
				// 	ref={(viewPager)=>{this.viewPager = viewPager}}
				// >
				// 	<View style={{flex:1}}>
				// 		<HomeScene navigator={this.props.navigator}/>
				// 	</View>
				// 	<View style={{flex:1}}>
				// 		<MyScene />
				// 	</View>
				// </ViewPagerAndroid>
		//var page = this.state.tabIndex===0?<HomeScene navigator={this.props.navigator}/>:<MyScene navigator={this.props.navigator}/>;
		return(
			<View style={{flex:1,justifyContent:'flex-end'}}>
				<Navigator
					initialRoute={{name: 'HomeScene'}}
					configureScene={(route) => {
						if (route.sceneConfig) {
							return route.sceneConfig;
						}
						return Navigator.SceneConfigs.FadeAndroid;
					}}
					renderScene={this.renderScene.bind(this)} />
				
				<View style={{backgroundColor:'#d5d5d5',height:1,}}/> 
				<View style={{height:55,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
					<TouchableOpacity style={{flex:1}} activeOpacity={0.6} onPress={this._onTabPress.bind(this,0)}>
						<View style={styles.ItemView}>
							<Image 
								style={{height:30,width:30}} 
								source={this.state.tabIndex==0?require('../img/icon_home_select.png'):require('../img/icon_home_unselect.png')}
							/>
							<Text style={this.state.tabIndex==0?styles.TabTextSelect:styles.TabTextUnSelect}>首页</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity style={{flex:1}} activeOpacity={0.6} onPress={this._onTabPress.bind(this,1)}>
						<View style={styles.ItemView}>
							<Image 
								style={{height:30,width:30}} 
								source={this.state.tabIndex==0?require('../img/icon_my_unselect.png'):require('../img/icon_my_select.png')}
							/>
							<Text style={this.state.tabIndex==0?styles.TabTextUnSelect:styles.TabTextSelect}>我的</Text>
						</View>
					</TouchableOpacity>
				</View>
				
			</View>
			
			);
	}

	//tab点击事件
  	_onTabPress(index){
//console.log('index = '+ index);
  		//this.viewPager.setPage(index);
  		this.setState({
  			tabIndex:index,
  		});
  		let len = this.nav.getCurrentRoutes().length;
		if(len <2 && index ==1){
			this.nav.push({
				name:'MyScene'
			});
		}else {
			this.nav.jumpTo(this.nav.getCurrentRoutes()[index]);
		}
  	}
}

var styles = StyleSheet.create({
	ItemView:{
		flex:1,
		justifyContent:'center',
		alignItems:'center',
		marginTop:3,
	},
	TabTextSelect:{
		flex:1,
		textAlign:'center',
		alignItems:'center',
		color:'#ff5722',
	},
	TabTextUnSelect:{
		flex:1,
		textAlign:'center',
		alignItems:'center',
		color:'#d5d5d5',
	},
});