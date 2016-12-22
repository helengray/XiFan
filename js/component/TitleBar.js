import React,{Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    /*Platform,*/
    TouchableOpacity,
} from 'react-native';

/*const IS_IOS = Platform.OS === 'ios';
const NAV_HEIGHT = IS_IOS?64:50;*/

export default class TitleBar extends Component{

    constructor(props){
        super(props);
    }

    static propTypes = {
        showLeftButton:React.PropTypes.bool,
        showRightButton:React.PropTypes.bool,
        titlePosition:React.PropTypes.oneOf("left","center","right"),
        titleText:React.PropTypes.string,
        subTitleText:React.PropTypes.string,
        onLeftButtonPress:React.PropTypes.func,
        onRightButtonPress:React.PropTypes.func,
        rightButtonText:React.PropTypes.string,
    };

    static defaultProps = {
        showLeftButton:true,
        showRightButton:false,
        titlePosition:'center',
        rightButtonText:''
    };

    _onLeftButtonPress(){
        if(this.props.onLeftButtonPress && this.props.onLeftButtonPress()){
            return;
        }
        const navigator = this.props.navigator;
        if(navigator){
            navigator.pop();
        }
    }

    _renderNavLeft(){
        if(!this.props.showLeftButton){
            if(this.props.showRightButton && this.props.titlePosition ==='center'){//当左边已显示时，右边显示个占位视图，使标题能够居中
                return <View style={styles.navBarLeft}/>
            }
            return null;
        }
        return(
            <TouchableOpacity
                style={styles.navBarLeft}
                activeOpacity={0.8}
                onPress={()=>this._onLeftButtonPress()}>

                <Image
                    style={styles.leftIcon}
                    source={require('../../img/ic_actionbar_back.png')}
                />

            </TouchableOpacity>
        );
    }

    _renderNavTitle(){
        var position;
        switch (this.props.titlePosition){
            case 'left':
                position = {alignItems:'flex-start'};
                break;
            case 'center':
                position = {alignItems:'center'};
                break;
            case 'right':
                position = {alignItems:'flex-end'};
                break;
            default:
                position = {alignItems:'flex-start'};
                break;
        }
        var titleStyle = [styles.navBarTitle,position];
        return (
            <View style={titleStyle}>
                {this._renderTitleText()}
                {this._renderSubTitleText()}
            </View>
        );
    }

    _renderTitleText(){
        if(this.props.titleText){
            return (<Text style={styles.titleText}>{this.props.titleText}</Text>);
        }else {
            return null;
        }
    }

    _renderSubTitleText(){
        if(this.props.subTitleText){
            return (<Text style={styles.subTitleText}>{this.props.subTitleText}</Text>);
        }else {
            return null;
        }
    }

    _renderNavRight(){
        if(!this.props.showRightButton){
            if(this.props.showLeftButton && this.props.titlePosition ==='center'){//当右边已显示时，左边显示个占位视图，使标题能够居中
                return <View style={styles.navBarRight}/>
            }
            return null;
        }

        return(
            <TouchableOpacity
                style={styles.navBarRight}
                activeOpacity={0.6}
                onPress={()=>this._onRightButtonPress()}>

                <Text style={styles.rightButtonText}>{this.props.rightButtonText}</Text>

            </TouchableOpacity>
        );
    }

    _onRightButtonPress(){
        if(this.props.onRightButtonPress){
            this.props.onRightButtonPress();
        }
    }

    render(){
        return(
            <View style={styles.navBar}>
                {this._renderNavLeft()}
                {this._renderNavTitle()}
                {this._renderNavRight()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    navBar:{
        height:50,
        backgroundColor:'#ff5722',
        flexDirection:'row',
    },
    navBarLeft:{
        width:55,
        justifyContent:'center',
        alignItems:'center'
    },
    leftIcon:{
        width:30,
        height:30,
    },
    navBarTitle:{
        flex:1,
        justifyContent:'center',
        paddingRight:8,
        paddingLeft:8
    },
    titleText:{
        fontSize:18,
        color:'white'
    },
    subTitleText:{
        fontSize:12,
        color:'white',
        marginTop:3
    },
    navBarRight:{
        width:55,
        justifyContent:'center',
        alignItems:'center'
    },
    rightButtonText:{
        fontSize:16,
        color:'white',
        fontWeight:'bold'
    }
});