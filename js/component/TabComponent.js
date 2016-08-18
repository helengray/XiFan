import React, { Component } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
} from 'react-native';

export default class TabComponent extends Component{

	constructor(props){
		super(props);
		this.state={
			tabIndex:0,
		}
	}

	static defaultProps = {
		tabTexts:[],
		tabUnSelectTextColor:'#d5d5d5',
		tabSelectTextColor:'white',
		tabUnderlineSelectColor:'white',
		tabUnderlineHeight:2,
	}

	render(){
		var page = this._renderTabItem(0,this.props.tabTexts[0]);
		return(
			<View style={{height:35,flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'#f74c31'}}>
			
				{
					// var tabTexts = this.props.tabTexts;
					// var length = tabTexts.length ;
					// for (var i = 0; i < length; i++) {
						
						page
					//}
				}
			</View>
			);
	}

	_renderTabItem(index,tabText){
		return(
			<View style={{height:35,flexDirection:'row',justifyContent:'space-around',alignItems:'center'}} key={tabText+index}>
				<TouchableOpacity style={{flex:1,}} activeOpacity={0.6} onPress={this._onTabPress.bind(this,index)}>
					<Text 
					style={
						this.state.tabIndex===index?
						{flex:1,textAlign:'center',color:this.props.tabSelectTextColor}
						:{flex:1,textAlign:'center',color:this.props.tabUnSelectTextColor}
					}>{tabText}</Text>
				</TouchableOpacity>
				<View 
				style={
					this.state.tabIndex===index?
					{backgroundColor:this.props.tabUnderlineSelectColor,height:this.props.tabUnderlineHeight}
					:{height:this.props.tabUnderlineHeight}}
				/>
			</View>
			);
	}

	_onTabPress(index){
		this.setState({
			tabIndex:index,
		});
		var onTabPress = this.props.onTabPress;
		if(onTabPress){
			onTabPress(index);
		}
	}
}
