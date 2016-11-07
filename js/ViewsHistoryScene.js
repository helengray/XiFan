import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ListView,
    RefreshControl,
    ToastAndroid
} from 'react-native';
import CheckBox from './component/CheckBox';
import TitleBar from './component/TitleBarComponent';
import DramaDetailScene from './DramaDetailScene';
import SQLite from './db/SQLite';
var sqlite = new SQLite();
var index = 1;
var datas = [];
var hasChange = false;
var toDeleteIds = [];
const PAGE_SIZE = 15;
export default class ViewsHistoryScene extends Component{
    constructor(props){
        super(props);
        this.state={
            movies:new ListView.DataSource({
                rowHasChanged:(r1,r2) => {
                    return r1!==r2 || hasChange;
                }
            }),
            isRefreshing:false,
            isDeleteMode:false,
        }
    }

    componentDidMount(){
        datas = [];
        index = 1;
        this._queryData();
    }

    _renderEmptyView(){
        return(
            <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
                <Text style={{fontSize:14,color:'gray'}}>你还没有观看哦，快去看看吧!</Text>
            </View>
        );
    }

    _renderMovieView(history){
        return(
            <TouchableOpacity activeOpacity={0.6} onPress={this._onItemPress.bind(this,history)} onLongPress={this._onItemLongPress.bind(this)}>
                <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                    <View style={styles.list_item}>
                        <Image style={{height:40,width:40}} source={{uri:history.pic}}/>
                        <View style={{flex:1}}>
                            <View style={{flexDirection:'row',flex:1,}}>
                                <Text numberOfLines={1} style={styles.list_item_name}>{history.name}</Text>
                                <Text style={styles.list_item_time}>{history.time}</Text>
                            </View>
                            <Text numberOfLines={1} style={styles.list_item_actor}>{history.indexName}</Text>
                        </View>
                    </View>
                    {this._renderCheckbox(history.id)}
                </View>
            </TouchableOpacity>
        );
    }

    /**
     * 复选框
     */
    _renderCheckbox(key){
        var checkbox = null;
        if(this.state.isDeleteMode){
            checkbox = (
                <CheckBox
                    id = {key}
                    style={{marginRight:12}}
                    isChecked={false}
                    onChange={(id,isChecked)=>{
                        if(isChecked){
                            toDeleteIds.push(id);
                        }else {
                            var index = toDeleteIds.indexOf(id);
                            if(index > 0){
                                toDeleteIds.splice(index,1);
                            }
                        }
                    }}
                />
            );
        }
        return checkbox;
    }

    /**
     * 底部操作按钮
     */
    _renderOptView(){
        if(this.state.isDeleteMode){
            return (
                <View style={{flexDirection:'row'}}>
                    <TouchableOpacity
                        style={{height:35,flex:1,backgroundColor:'#aaaaaa',alignItems:'center',justifyContent:'center'}}
                        activeOpacity={0.8}
                        onPress={this._onCancelPress.bind(this)}>
                        <Text style={{color:'white',fontSize:16}}>取消</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{height:35,flex:1,backgroundColor:'#ff5722',alignItems:'center',justifyContent:'center'}}
                        activeOpacity={0.8}
                        onPress={this._onDeletePress.bind(this)}>
                        <Text style={{color:'white',fontSize:16}}>删除</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        return null;
    }

    _onCancelPress(){
        hasChange = true;
        this.setState({
            movies:this.state.movies.cloneWithRows(datas),
            isDeleteMode:false,
        });
        //清空
        toDeleteIds = [];
    }

    _onDeletePress(){
        if(toDeleteIds.length != 0){
            sqlite.deleteHistoryByIds(toDeleteIds)
                .then(()=>{
                    ToastAndroid.show('删除成功',ToastAndroid.SHORT);
                    //清空
                    toDeleteIds = [];
                    this._onRefresh();
                })
                .catch((err)=>{
                    this._onCancelPress();
                }).done();
        }else{
            ToastAndroid.show('请选择删除项',ToastAndroid.SHORT);
        }

    }

    _onItemPress(movie){
        if(!this.state.isDeleteMode) {
            const navigator = this.props.navigator;
            if (navigator) {
                navigator.push({
                    id: 'DramaDetailScene',
                    data: movie,
                    name: movie.name,
                    component: DramaDetailScene
                });
            }
        }
    }

    _onItemLongPress(){
        if(!this.state.isDeleteMode){
            hasChange = true;
            this.setState({
                movies:this.state.movies.cloneWithRows(datas),
                isDeleteMode:true,
            });
        }else {
            hasChange = false;
        }
    }

    _onEndReached(){
        if(datas.length < PAGE_SIZE){
            return;
        }
        index ++;
        this._queryData();
    }

    _onRefresh(){
        datas = [];
        index = 1;
        this._queryData();
    }

    _queryData(){
        sqlite.listHistory(PAGE_SIZE,index).then((results)=>{
            datas = datas.concat(results);
            this.setState({
                movies:this.state.movies.cloneWithRows(datas),
                isRefreshing:false,
                isDeleteMode:false,
            });
        }).catch((err)=>{

        }).done();
    }

    render(){
        var page = null;
        if(datas.length === 0){
            page = this._renderEmptyView();
        }else {
            page = (<ListView
                ref="myListView"
                dataSource={this.state.movies}
                renderRow={this._renderMovieView.bind(this)}
                renderSeparator={(sectionID,rowID)=>{
                    return <View style={styles.list_divider} key={rowID} />
                }}
                style={styles.list_view}
                initialListSize={PAGE_SIZE}
                pageSize={PAGE_SIZE}
                onEndReachedThreshold={5}
                onEndReached={this._onEndReached.bind(this)}
                enableEmptySections={true}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isRefreshing}
                        onRefresh={this._onRefresh.bind(this)}
                        colors={['#f74c31', '#f74c31', '#f74c31', '#f74c31']}
                        progressBackgroundColor='#ffffff'
                    />
                }
            />);
        }
        return(
            <View style={{flex:1}}>
                <TitleBar title={this.props.name} subtitle='' subScene={true} hasMore={false} navigator={this.props.navigator}/>
                {page}
                {this._renderOptView()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    list_view:{
        flex:1,
        backgroundColor:'white',
    },
    list_item:{
        flex:1,
        flexDirection:'row',
        margin:12,
    },
    list_item_name:{
        fontSize:14,
        color:'black',
        marginLeft:12,
        flex:1,
    },
    list_item_time:{
        fontSize:12,
        color:'gray',
    },
    list_item_actor:{
        fontSize:12,
        color:'gray',
        marginLeft:12
    },
    list_divider:{
        height:0.5,
        backgroundColor:'#aaaaaa'
    }
});