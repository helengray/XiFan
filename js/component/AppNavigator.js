import React,{Component} from 'react';
import {
	Navigator,
} from 'react-native';
//应用导航器
export default class AppNavigator extends Component{
	constructor(props){
		super(props);
	}
	render(){
		return(
			<Navigator 
		        initialRoute={{id:this.props.id,data:this.props.data,name:this.props.name,component:this.props.component}}
		        renderScene={(route,navigator)=>{
		          let Scene = route.component;
		          return <Scene id={route.id} data={route.data} name={route.name} navigator={navigator}/>
		        }}
		        style={{flex:1,}}
		        configureScene={(route) => {
		          if(route.sceneConfig){
		            return route.sceneConfig;
		          }
		          return Navigator.SceneConfigs.HorizontalSwipeJump;
		        }}
		      />
			);
	}
}