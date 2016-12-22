import React,{Component} from 'react';
import {
	Platform,
	BackAndroid,
} from 'react-native';


import XTabBar from './component/XTabBar';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Toast from './component/Toast';
import HomeScene from './HomeScene'
import MyScene from './MyScene';
import SQLite from './db/SQLite';
var sqLite = new SQLite();
//首页
export default class MainScene extends Component{
	constructor(props){
		super(props);
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
                        Toast.show("再按一次退出程序");
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


	render(){
		return(
			<ScrollableTabView
				initialPage={0}
				tabBarPosition="bottom"
				renderTabBar={()=>
					<XTabBar
						activeTextColor="#ff5722"
						inactiveTextColor="#d5d5d5"
						activeIcons={[require('../img/icon_home_select.png'),require('../img/icon_my_select.png')]}
						inactiveIcons={[require('../img/icon_home_unselect.png'),require('../img/icon_my_unselect.png')]}
						/>
				}
			>

				<HomeScene tabLabel="首页" navigator={this.props.navigator}/>

				<MyScene tabLabel="我的" navigator={this.props.navigator}/>

			</ScrollableTabView>
			);
	}

}
