import React, {Component} from 'react';
import {
    Navigator,
    Platform,
    /*View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    StatusBar*/
} from 'react-native';

let isIOS = Platform.OS === 'ios';
//let TitleBarHeight = isIOS?64:50;
//应用导航器
export default class AppNavigator extends Component {
    constructor(props) {
        super(props);
    }

    /*_renderLeftButton(route,navigator,index,navState){
        var isShow = route.showLeftButton;
        if(isShow == null){
            isShow = true;
        }
        if(!isShow){
            return null;
        }
        return (
            <TouchableOpacity style={styles.navBarLeft} onPress={
                () => navigator.pop()
            }>
                <Image
                    style={styles.leftButton}
                    source={require('../../img/ic_actionbar_back.png')}
                />
            </TouchableOpacity>
        );
    }

    _renderRightButton(route,navigator,index,navState){
        return null;
    }

    _renderTitle(route,navigator,index,navState){
        return (
            <View style={styles.navBarTitle}>
                <Text style={styles.titleText}>{index==0?this.state.title:route.title}</Text>
            </View>

        );
    }

    _renderNavBar(){
        if(this.state.displayNavBar === false){
            return null;
        }else {
            return(
                <Navigator.NavigationBar
                    style={styles.toolbar}
                    routeMapper={{
                        LeftButton:this._renderLeftButton.bind(this),
                        RightButton:this._renderRightButton.bind(this),
                        Title:this._renderTitle.bind(this)
                    }}/>
            );
        }
    }

    setTitle(title){
        this.setState({
            title:title,
        });
    }
    //TODO 隐藏头部导航栏，目前没有什么较好的解决方案
    displayNavBar(display){
        this.setState({
            displayNavBar:display
        });
    }*/

    render() {
        return (
            <Navigator
                initialRoute={{
                    id: this.props.id,
                    data: this.props.data,
                    titleText: this.props.titleText,
                    component: this.props.component,
                }}
                renderScene={(route, navigator)=> {
                    let Scene = route.component;
                    //props parentRef={this}
                    return (
                        <Scene
                        id={route.id}
                        data={route.data}
                        titleText={route.titleText}
                        subTitleText={route.subTitleText}
                        navigator={navigator}
                        />
                        );
                }}
                configureScene={(route) => {
                    if (route.sceneConfig) {
                        return route.sceneConfig;
                    }
                    var conf = Navigator.SceneConfigs.HorizontalSwipeJump;
                    conf.gestures = null;
                    return conf;
                }}
                sceneStyle={{marginTop:isIOS?20:0}}
            />
        );
    }
}

/*const styles = StyleSheet.create({
    toolbar:{
        height:TitleBarHeight,
        backgroundColor:'#ff5722',
    },
    navBarTitle:{
        flex:1,
        width:250,
        alignItems:'center',
        justifyContent:'center',
    },
    titleText:{
        fontSize:18,
        color:'white',
        textAlign:'center'
    },
    navBarLeft:{
        width:40,
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    leftButton:{
        height:30,
        width:30,
    }
});*/