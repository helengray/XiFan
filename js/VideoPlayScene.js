import React, {Component} from 'react';
import {
    View,
    WebView,
    Text,
    NativeModules,
} from 'react-native';
var Orientation = NativeModules.Orientation;
import VideoView from './component/VideoView';

export default class VideoPlayScene extends Component {
    constructor(props) {
        super(props);
        this._onPrepared = this._onPrepared.bind(this);
        this.state = {
            time:0,
            totalTime:0,
        };
    }

    componentWillMount() {
//		var ori = Orientation.initOrientation;
//console.log('current orientation :'+ori);
        // Orientation.getRequestedOrientation((orientation)=>{
        // 	console.log('current orientation2 :'+orientation);
        // });
        //Orientation.setOrientation(Orientation.LANDSCAPE);
    }

    componentWillUnmount() {
//console.log('componentWillUnmount');
        //Orientation.setOrientation(Orientation.PORTRAIT);
    }

    // function t_hn1(l_i,this_Obj,s_f){
    // 	if(l_i.indexOf("&icode=")<=0)l_i=l_i+"&icode="+l_i;
    // 	t_hn(l_i,this_Obj,s_f);}
    _onPrepared(duration){//毫秒
        console.log("JS duration = "+duration);
        this.setState({
            totalTime:duration,
        });
    }

    render() {
        return (
            <View style={{flex: 1,justifyContent: 'center',}}>
                <VideoView
                    style={{height: 250, width: 380}}
                    source={
                    {
                        url: 'http://qiubai-video.qiushibaike.com/A14EXG7JQ53PYURP.mp4',
                        headers: {
                            'refer': 'myRefer'
                        }
                    }
                    }
                    onPrepared={this._onPrepared}
                    onCompletion={()=>{
                        console.log("JS onCompletion");
                    }}
                    onError={(e)=>{
                        console.log("what="+e.what+" extra="+e.extra);
                    }}
                    onBufferUpdate={(buffer)=>{
                        console.log("JS buffer = "+buffer);
                    }}
                    onProgress={(progress)=>{
                        console.log("JS progress = "+progress);
                        this.setState({
                            time:progress
                        });
                    }}
                />
                <View style={{height:50,flexDirection:'row',justifyContent:'flex-start'}}>
                    <Text>{this.state.time}/{this.state.totalTime}</Text>
                </View>

            </View>
        );
        /*var html = '';
        var url = '';
        switch (this.props.data.type) {
            case 'bili':
                url = this.props.data.url;
                html =
                    '<html>' +
                    '<body>' +
                    '<div style="width:100%;height:225px;overflow:hidden;border:0px;margin:auto;position:absolute;top:0px;right:0px;bottom:0px;left:0px;">' +
                    '<div style="width:100%;height:300px;margin:-41px 0px 0px 0px;">' +
                    '<iframe  src="' + this.props.data.url + '" width="100%" height="300" scrolling="no" frameBorder="0" allowfullscreen="true"></iframe>' +
                    '</dive>' +
                    '</div>' +
                    '</body>' +
                    '</html>';
                break;
            case 'yk':
            case 'ai_q':
            case 'ck_m':
            case 'd_ac':
                html =
                    '<html>' +
                    '<body>' +
                    '<video style="width:100%;height:100%;margin:auto;position:absolute;top:0px;right:0px;bottom:0px;left:0px;" controls autoplay >' +
                    '<source src="' + this.props.data.url + '" type="video/mp4">' +
                    '</video>' +
                    '</body>' +
                    '</html>';
                break;
            case 'yk_d':
                url = this.props.data.url;
                html =
                    '<html>' +
                    '<body>' +
                    '<div style="width:100%;height:213px;overflow:hidden;border:0px;margin:auto;position:absolute;top:0px;right:0px;bottom:0px;left:0px;">' +
                    '<div style="width:100%;height:300px;margin:-41px 0px 0px 0px;">' +
                    '<iframe  src="' + this.props.data.url + '" width="100%" height="242" scrolling="no" frameBorder="0" allowfullscreen="true"></iframe>' +
                    '</dive>' +
                    '</div>' +
                    '</body>' +
                    '</html>';
                break;
            case 'td':
                url = this.props.data.url;
                html =
                    '<html>' +
                    '<body>' +
                    '<div style="width:100%;height:250px;border:0px;margin:auto;position:absolute;top:0px;right:0px;bottom:0px;left:0px;">' +
                    '<iframe  src="' + this.props.data.url + '" width="100%" height="255" scrolling="no" frameBorder="0" allowfullscreen="true"></iframe>' +
                    '</div>' +
                    '</body>' +
                    '</html>';
                break;
            case 'ai_u':
                url = this.props.data.url;
                break;
        }
        if (html) {
            console.log('html');
            return (
                <View style={{flex: 1, backgroundColor: 'black',}}>
                    <WebView
                        style={{flex: 1, backgroundColor: 'black',}}
                        source={{html: html}}
                        javaScriptEnabled={true}//android
                        domStorageEnabled={true}//android
                        startInLoadingState={true}
                        scalesPageToFit={true}
                        automaticallyAdjustContentInsets={true}//
                        allowsInlineMediaPlayback={true}//ios
                        scrollEnabled={false}//ios
                        renderError={()=> {
                            console.log('渲染失败');
                        }}
                        onError={(e)=> {
                            console.log('网页加载失败 e = ' + e.toString());
                        }}
                        onLoad={()=> {
                            console.log('网页成功加载完成');
                        }}
                        onLoadEnd={()=> {
                            console.log('网页加载结束');
                        }}
                        onLoadStart={()=> {
                            console.log('网页开始加载');
                        }}
                        onShouldStartLoadWithRequest={(request)=> {
                            console.log('点击请求 url' + request);
                        }}
                    />
                </View>
            );
        } else {
            console.log('url=' + url);
            return (
                <View style={{flex: 1, backgroundColor: 'black',}}>
                    <WebView
                        style={{flex: 1, backgroundColor: 'black',}}
                        source={{uri: url}}
                        javaScriptEnabled={true}//android
                        domStorageEnabled={true}//android
                        startInLoadingState={true}
                        scalesPageToFit={true}
                        automaticallyAdjustContentInsets={true}//
                        allowsInlineMediaPlayback={true}//ios
                        scrollEnabled={false}//ios
                        renderError={()=> {
                            console.log('渲染失败');
                        }}
                        onError={(e)=> {
                            console.log('网页加载失败 e = ' + e.toString());
                        }}
                        onLoad={()=> {
                            console.log('网页成功加载完成');
                        }}
                        onLoadEnd={()=> {
                            console.log('网页加载结束');
                        }}
                        onLoadStart={()=> {
                            console.log('网页开始加载');
                        }}
                        onShouldStartLoadWithRequest={(request)=> {
                            console.log('点击请求 url' + request);
                        }}
                    />
                </View>
            );
        }*/
    }
}