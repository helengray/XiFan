import React,{ PropTypes,Component} from 'react';
import {
    requireNativeComponent,
    View,
    UIManager,
    findNodeHandle,
} from 'react-native';


/*var VideoView = React.createClass({
    propTypes:{
        style: View.propTypes.style,
        source:PropTypes.shape({
            url:PropTypes.string,
            headers:PropTypes.object,
        }),
        ...View.propTypes,//包含默认的View的属性
    },

    render(){
        return(
            <RCTVideoView
                style = {this.props.style}
                source = {this.props.source}
            />
        );
    }
});*/
/*var VideoView = {
    name:'VideoView',
    propTypes:{
        style: View.propTypes.style,
        source:PropTypes.shape({
            url:PropTypes.string,
            headers:PropTypes.object,
        }),
        ...View.propTypes,//包含默认的View的属性，如果没有这句会报‘has no propType for native prop’错误
    }
};*/

var RCT_VIDEO_REF = 'VideoView';

class VideoView extends Component{
    constructor(props){
        super(props);
    }

    /*_onChange(event){
        if(!this.props.onPrepared){
            return;
        }
        this.props.onPrepared(event.nativeEvent.duration);
    }*/

    _onPrepared(event){
        if(!this.props.onPrepared){
            return;
        }
        this.props.onPrepared(event.nativeEvent.duration);
    }

    _onError(event){
        if(!this.props.onError){
            return;
        }
        this.props.onError(event.nativeEvent);
    }

    _onBufferUpdate(event){
        if(!this.props.onBufferUpdate){
            return;
        }
        this.props.onBufferUpdate(event.nativeEvent.buffer);
    }

    _onProgress(event){
        if(!this.props.onProgress){
            return;
        }
        this.props.onProgress(event.nativeEvent.progress);
    }

    pause(){
        UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.refs[RCT_VIDEO_REF]),
            UIManager.VideoView.Commands.pause,//Commands.pause与native层定义的COMMAND_PAUSE_NAME一致
            null//命令携带的参数数据
        );
    }

    start(){
        UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.refs[RCT_VIDEO_REF]),
            UIManager.VideoView.Commands.start,
            null
        );
    }

    seekTo(millSecond){
        UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.refs[RCT_VIDEO_REF]),
            UIManager.VideoView.Commands.seekTo,
            [millSecond]
        );
    }

    render(){
        //return <RCTVideoView {...this.props} onChange={this._onChange.bind(this)}/>;
        return <RCTVideoView
            {...this.props}
            ref = {RCT_VIDEO_REF}
            onPrepared={this._onPrepared.bind(this)}
            onError={this._onError.bind(this)}
            onBufferUpdate={this._onBufferUpdate.bind(this)}
            onProgress={this._onProgress.bind(this)}
        />;
    };
}

VideoView.name = "VideoView";
VideoView.propTypes = {
    onPrepared:PropTypes.func,
    onCompletion:PropTypes.func,
    onError:PropTypes.func,
    onBufferUpdate:PropTypes.func,
    onProgress:PropTypes.func,
    style: View.propTypes.style,
    source:PropTypes.shape({
        url:PropTypes.string,
        headers:PropTypes.object,
    }),
    ...View.propTypes,
};

var RCTVideoView = requireNativeComponent('VideoView',VideoView,{
    nativeOnly: {onChange: true}
});
module.exports = VideoView;
