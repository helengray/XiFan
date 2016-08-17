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
	BackAndroid
} from 'react-native';
import HomeScene from './HomeScene'
import MyScene from './MyScene';
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
	}

	componentWillUnMount(){
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
	}

	render(){
		var page = this.state.tabIndex===0?<HomeScene navigator={this.props.navigator}/>:<MyScene />;
		return(
			<View style={{flex:1,justifyContent:'flex-end',overflow:'hidden'}}>
				{page}
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
  		console.log('index = '+ index);
  		this.setState({
  			tabIndex:index,
  		});
  		
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
		color:'#f74c31',
	},
	TabTextUnSelect:{
		flex:1,
		textAlign:'center',
		alignItems:'center',
		color:'#d5d5d5',
	},
});