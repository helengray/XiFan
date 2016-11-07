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
import DramaDetailScene from './DramaDetailScene';
import TitleBar from './component/TitleBarComponent';
import SQLite from './db/SQLite';
var sqlite = new SQLite();
var index = 1;
var datas = [];
export default class MyCollectionScene extends Component{
    constructor(props){
        super(props);
        this.state={
            movies:new ListView.DataSource({
                rowHasChanged:(r1,r2) => r1!=r2
            }),
            isRefreshing:false,
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
                <Text style={{fontSize:14,color:'gray'}}>你还没有收藏哦~</Text>
            </View>
        );
    }

    _renderMovieView(movie){
        return(
            <TouchableOpacity activeOpacity={0.6} onPress={this._onItemPress.bind(this,movie)}>
                <View>
                    <View style={styles.list_item}>
                        <Image style={{height:40,width:40}} source={{uri:movie.pic}}/>
                        <View style={{flex:1}}>
                            <View style={{flexDirection:'row',flex:1,}}>
                                <Text numberOfLines={1} style={styles.list_item_name}>{movie.name}</Text>
                                <Text style={styles.list_item_time}>{movie.time}</Text>
                            </View>
                            <Text numberOfLines={1} style={styles.list_item_actor}>{movie.actor}</Text>
                        </View>
                    </View>
                    <View style={styles.list_divider}/>
                </View>
            </TouchableOpacity>
        );
    }

    _onItemPress(movie){
        const navigator = this.props.navigator;
        if(navigator){
            navigator.push({
                id:'DramaDetailScene',
                data:movie,
                name:movie.name,
                component:DramaDetailScene
            });
        }
    }

    _onEndReached(){
        index ++;
        this._queryData();
    }

    _onRefresh(){
        datas = [];
        index = 1;
        this._queryData();
    }

    _queryData(){
        sqlite.listCollection(10,index).then((results)=>{
            datas = datas.concat(results);
            this.setState({
                movies:this.state.movies.cloneWithRows(datas),
                isRefreshing:false
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
                dataSource={this.state.movies}
                renderRow={this._renderMovieView.bind(this)}
                style={styles.list_view}
                initialListSize={10}
                pageSize={10}
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
                <TitleBar title={this.props.name} subtitle='' subScene={true} navigator={this.props.navigator}/>
                {page}
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