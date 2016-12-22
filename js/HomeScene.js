import React,{Component} from 'react';
import {
	View,
	Text,
	Platform,
	StyleSheet,
	ViewPagerAndroid,
	TouchableOpacity,
	Navigator,
	BackAndroid,
} from 'react-native';

import TitleBar from './component/TitleBar';
import BaseTitleBarScene from './component/BaseTitleBarScene';
import DramaComponent from './component/DramaComponent'
import ScrollableTabView from 'react-native-scrollable-tab-view';
//首页
export default class HomeScene extends BaseTitleBarScene{

	constructor(props){
		super(props);
		this.state = {
		  tabIndex:0,
		};
	}

	static defaultProps = {
        titleText:"首页",
        subTitleText:"看韩剧，上稀饭",
        showLeftButton:false,
		titlePosition:'left'
	};


	renderContent(){
		return(
			<ScrollableTabView
				initialPage={0}
				tabBarBackgroundColor="#ff5722"
				tabBarInactiveTextColor="#d5d5d5"
				tabBarActiveTextColor="white"
				tabBarUnderlineStyle={{backgroundColor:"white"}}
			>
				<DramaComponent tabLabel="最新" url='/hanju/new/' navigator={this.props.navigator}/>
				<DramaComponent tabLabel="最热" url='/hanju/renqi/' navigator={this.props.navigator}/>
			</ScrollableTabView>
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
	
}