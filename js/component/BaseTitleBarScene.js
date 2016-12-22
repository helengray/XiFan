/**
 * Created by helen on 2016/12/22.
 */
import React,{Component} from 'react';
import {
    View,
} from 'react-native';

import TitleBar from './TitleBar';
/**
 * 带有标题栏的场景
 */
export default class BaseTitleBarScene extends Component{

    /**
     * 渲染内容部分
     */
    renderContent(){
        return null;
    }
    /**
     右按钮点击事件
     @return true表示点击事件已消费
     */
    onRightButtonPress(){
        return false;
    }
    /**
     左按钮点击事件
     @return true表示点击事件已消费
     */
    onLeftButtonPress(){
        return false;
    }

    /**
     * 是否显示右按钮
     * @return {true 表示显示}
     */
    showLeftButton(){
        if(this.props.showLeftButton != null){
            return this.props.showLeftButton;
        }
        return true;
    }

    /**
     * 是否显示左按钮
     * @return {true 表示显示}
     */
    showRightButton(){
        if(this.props.showRightButton != null){
            return this.props.showRightButton;
        }
        return false;
    }

    _renderTitleBar(){
        return (
            <TitleBar
                titleText={this.props.titleText}
                subTitleText={this.props.subTitleText}
                showLeftButton={this.showLeftButton()}
                navigator={this.props.navigator}
                showRightButton={this.showRightButton()}
                rightButtonText={this.props.rightButtonText}
                onLeftButtonPress={()=>this.onLeftButtonPress()}
                onRightButtonPress={()=>this.onRightButtonPress()}
                titlePosition={this.props.titlePosition}
            />
        );
    }

    render(){
        return(
            <View style={{flex:1}}>
                {this._renderTitleBar()}
                <View style={{flex:1}}>
                    {this.renderContent()}
                </View>
            </View>
        );
    }
}