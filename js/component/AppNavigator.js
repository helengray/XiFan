import React, {Component} from 'react';
import {
    Navigator,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native';
//应用导航器
export default class AppNavigator extends Component {
    constructor(props) {
        super(props);
    }

    _renderLeftButton(route,navigator,index,navState){
        var isShow = route.showLeftButton;
        if(isShow == null){
            isShow = true;
        }
        if(!isShow){
            return null;
        }
        return (
            <TouchableOpacity onPress={
                () => navigator.pop()
            }>
                <Image
                    style={styles.left}
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
            <Text style={styles.title}>{route.title}</Text>
        );
    }

    render() {
        return (
            <Navigator
                initialRoute={{
                    id: this.props.id,
                    data: this.props.data,
                    title: this.props.name,
                    component: this.props.component,
                    showLeftButton:this.props.showLeftButton,
                    displayNavBar:this.props.displayNavBar
                }}
                renderScene={(route, navigator)=> {
                    let Scene = route.component;
                    return <Scene id={route.id} data={route.data} name={route.title} navigator={navigator}/>
                }}
                style={{flex: 1,}}
                configureScene={(route) => {
                    if (route.sceneConfig) {
                        return route.sceneConfig;
                    }
                    var conf = Navigator.SceneConfigs.HorizontalSwipeJump;
                    conf.gestures = null;
                    return conf;
                }}
                navigationBar={
                    <Navigator.NavigationBar
                    style={styles.toolbar}
                    routeMapper={{
                        LeftButton:this._renderLeftButton.bind(this),
                        RightButton:this._renderRightButton.bind(this),
                        Title:this._renderTitle.bind(this)
                    }}/>
                }
                sceneStyle={{marginTop:60}}
            />
        );
    }
}

const styles = StyleSheet.create({
    toolbar:{
        height:60,
        backgroundColor:'#ff5722',
    },
    title:{
        fontSize:16,
        color:'white',
        marginTop:12,
    },
    left:{
        height:30,
        width:30,
        marginTop:5,
        marginLeft:12,
    }
});