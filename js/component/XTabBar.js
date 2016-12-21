import React,{Component} from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

export default class XTabBar extends Component{

    static propTypes = {
        goToPage: React.PropTypes.func, // 跳转到对应tab的方法
        activeTab: React.PropTypes.number, // 当前被选中的tab下标
        tabs: React.PropTypes.array, // 所有tabs集合
        backgroundColor: React.PropTypes.string,//
        activeTextColor: React.PropTypes.string,
        inactiveTextColor: React.PropTypes.string,
        activeIcons:React.PropTypes.arrayOf(React.PropTypes.number),
        inactiveIcons:React.PropTypes.arrayOf(React.PropTypes.number)
    };

    renderTab(name, page, isTabActive, onPressHandler){
        const textColor = isTabActive ? this.props.activeTextColor : this.props.inactiveTextColor;
        var src;
        if(isTabActive){
            src = this.props.activeIcons[page];
        }else {
            src = this.props.inactiveIcons[page];
        }

        return (
            <TouchableOpacity onPress={()=>onPressHandler(page)} key={page}>
                <View style={styles.tab} >
                    <Image
                        style={{height:30,width:30,resizeMode: Image.resizeMode.strech,}}
                        source={src}
                    />
                    <Text style={[styles.tabText,{color:textColor}]}>{name}</Text>
                </View>
            </TouchableOpacity>

        );
    };


    render(){
        return (
            <View style={[styles.tabs, {backgroundColor: this.props.backgroundColor}]}>
                {this.props.tabs.map((name, page) => {
                    const isTabActive = this.props.activeTab === page;
                    return this.renderTab(name, page, isTabActive, this.props.goToPage);
                })}
            </View>
        );
    }
}

var styles = StyleSheet.create({
    tabs: {
        height: 55,
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth:0,
        borderColor: '#ccc',
        paddingTop:3,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabText:{
        flex:1,
        textAlign:'center',
        alignItems:'center',
        fontSize:14
    },
});