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
import TitleBar from './component/TitleBarComponent';
export default class ViewsHistoryScene extends Component{
    constructor(props){
        super(props);
        this.state={
            movies:new ListView.DataSource({
                rowHasChanged:(r1,r2) => r1!=r2
            }),
            isRefreshing:false,
        }
    }

    _renderMovieView(){

    }

    _onEndReached(){

    }

    _onRefresh(){

    }

    render(){
        return(
            <View style={{flex:1}}>
                <TitleBar title={this.props.name} subtitle='' subScene={true} navigator={this.props.navigator}/>
                <ListView
                    dataSource = {this.state.movies}
                    renderRow = {this._renderMovieView.bind(this)}
                    style = {styles.list_view}
                    initialListSize = {10}
                    pageSize = {10}
                    onEndReachedThreshold = {5}
                    onEndReached = {this._onEndReached.bind(this)}
                    enableEmptySections = {true}
                    //contentContainerStyle = {styles.grid}
                    refreshControl = {
                        <RefreshControl
                            refreshing = {this.state.isRefreshing}
                            onRefresh = {this._onRefresh.bind(this)}
                            colors = {['#f74c31', '#f74c31', '#f74c31','#f74c31']}
                            progressBackgroundColor = '#ffffff'
                        />
                    }
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    list_view:{
        flex:1
    }
});