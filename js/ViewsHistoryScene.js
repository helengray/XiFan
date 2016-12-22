import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ListView,
    RefreshControl,
} from 'react-native';

import BaseTitleBarScene from './component/BaseTitleBarScene';
import Toast from './component/Toast';
import CheckBox from './component/CheckBox';
import DramaDetailScene from './DramaDetailScene';
import SQLite from './db/SQLite';

var sqlite = new SQLite();
var index = 1;
var datas = [];
var hasChange = false;
var toDeleteIds = [];
const PAGE_SIZE = 10;
const CheckBoxName = 'CheckBox';
var CheckBoxRefs = {};//存放item checkbox ref
export default class ViewsHistoryScene extends BaseTitleBarScene{
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
            isAllSelect:false,//是否全选
        }
    }

    static defaultProps = {
        titleText:'观看历史',
        rightButtonText:'全选',
    }

    showRightButton(){
        return this.state.isDeleteMode;
    }

    onRightButtonPress(){
        this._selectAll();
        return true;
    }

    componentDidMount(){
        datas = [];
        index = 1;
        CheckBoxRefs = {};
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
    _renderCheckbox(key){//使用数据id作为key
        var checkbox = null;
        if(this.state.isDeleteMode){
            checkbox = (
                <CheckBox
                    ref={(checkbox)=>{
                        CheckBoxRefs[`${CheckBoxName}${key}`] = checkbox;
                    }}
                    id = {key}
                    style={{marginRight:12}}
                    isChecked={this.state.isAllSelect}
                    onChange={(id,isChecked)=>{
                        if(isChecked){
                            toDeleteIds.push(id);
                        }else {
                            var index = toDeleteIds.indexOf(id);
                            if(index >= 0){
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
                        style={{height:50,flex:1,backgroundColor:'#aaaaaa',alignItems:'center',justifyContent:'center'}}
                        activeOpacity={0.8}
                        onPress={this._onCancelPress.bind(this)}>
                        <Text style={{color:'white',fontSize:16}}>取消</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{height:50,flex:1,backgroundColor:'#ff5722',alignItems:'center',justifyContent:'center'}}
                        activeOpacity={0.8}
                        onPress={this._onDeletePress.bind(this)}>
                        <Text style={{color:'white',fontSize:16}}>删除</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        return null;
    }

    _selectAll(){
        this.setState({
            isAllSelect:!this.state.isAllSelect,
        });
        for (var key in CheckBoxRefs){
            var item = CheckBoxRefs[key];
            if(item){
                item.check(!item.isCheck());
            }else {
                delete CheckBoxRefs[key];
            }
        }
    }

    _onCancelPress(){
        hasChange = true;
        this.setState({
            movies:this.state.movies.cloneWithRows(datas),
            isDeleteMode:false,
            isAllSelect:false,
        });
        //清空
        toDeleteIds = [];
    }

    _onDeletePress(){
        //console.log(JSON.stringify(toDeleteIds));
        if(toDeleteIds.length != 0){
            sqlite.deleteHistoryByIds(toDeleteIds)
                .then(()=>{
                    Toast.show('删除成功');
                    this.setState({
                        isDeleteMode:false,
                        isAllSelect:false,
                    });
                    this._onRefresh();
                })
                .catch((err)=>{
                    this._onCancelPress();
                }).done();
        }else{
            Toast.show('请选择删除项');
        }
    }

    _onItemPress(movie){
        if(!this.state.isDeleteMode) {
            const navigator = this.props.navigator;
            if (navigator) {
                navigator.push({
                    id: 'DramaDetailScene',
                    data: movie,
                    title: movie.name,
                    component: DramaDetailScene
                });
            }
        }else {
            var item = CheckBoxRefs[`${CheckBoxName}${movie.id}`];
            if(item){
                item.check(!item.isCheck());
            }
        }
    }

    _onItemLongPress(){
        if(!this.state.isDeleteMode){
            hasChange = true;
            this.setState({
                //一定要调用这个，否则列表不会刷新，ListView.DataSource$rowHasChanged不会被调用
                //列表是否刷新取决于ListView.DataSource$rowHasChanged的返回值，true表示刷新,false表示不用刷新
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
        CheckBoxRefs = {};
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
            });
        }).catch((err)=>{
            console.log(err);
            Toast.show('获取数据失败');
        }).done();
    }

    renderContent(){
        var page = null;
        if(datas.length === 0){
            page = this._renderEmptyView();
        }else {
            page = (<ListView
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