package com.xifan.module;

import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.widget.VideoView;

import com.facebook.common.logging.FLog;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

/**
 * Created by Helen on 2016/9/19.
 *
 */
public class VideoViewManager extends SimpleViewManager<VideoView>{

    private enum VideoEvent{
        EVENT_PREPARE("onPrepared"),
        EVENT_PROGRESS("onProgress"),
        EVENT_UPDATE("onBufferUpdate"),
        EVENT_ERROR("onError"),
        EVENT_COMPLETION("onCompletion");

        private String mName;
        VideoEvent(String name) {
            this.mName = name;
        }

        @Override
        public String toString() {
            return mName;
        }
    }

    @Override
    public String getName() {
        return "VideoView";
    }

    @Override
    protected VideoView createViewInstance(ThemedReactContext reactContext) {
        RCTVideoView video = new RCTVideoView(reactContext);
        return video;
    }

    @Nullable
    @Override
    public Map<String, Integer> getCommandsMap() {
        return super.getCommandsMap();
    }

    @Override
    public void receiveCommand(VideoView root, int commandId, @Nullable ReadableArray args) {
        super.receiveCommand(root, commandId, args);
    }

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        MapBuilder.Builder<String, Object> builder = MapBuilder.builder();
        for (VideoEvent event:VideoEvent.values()){
            builder.put(event.toString(),MapBuilder.of("registrationName", event.toString()));
        }
        return builder.build();
    }

    @Override
    public void onDropViewInstance(VideoView view) {//销毁对象时释放一些资源
        super.onDropViewInstance(view);
        ((ThemedReactContext) view.getContext()).removeLifecycleEventListener((RCTVideoView) view);
         view.stopPlayback();
    }


    @ReactProp(name = "source")
    public void setSource(RCTVideoView videoView,@Nullable ReadableMap source){
        if(source != null){
            if (source.hasKey("url")) {
                String url = source.getString("url");
                FLog.e(VideoViewManager.class,"url = "+url);
                HashMap<String, String> headerMap = new HashMap<>();
                if (source.hasKey("headers")) {
                    ReadableMap headers = source.getMap("headers");
                    ReadableMapKeySetIterator iter = headers.keySetIterator();
                    while (iter.hasNextKey()) {
                        String key = iter.nextKey();
                        String value = headers.getString(key);
                        FLog.e(VideoViewManager.class,key+" = "+value);
                        headerMap.put(key,value);
                    }
                }
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    videoView.setVideoURI(Uri.parse(url),headerMap);
                }else{
                    try {
                        Method setVideoURIMethod = videoView.getClass().getMethod("setVideoURI", Uri.class, Map.class);
                        setVideoURIMethod.invoke(videoView, Uri.parse(url), headerMap);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
                videoView.start();
            }
        }
    }

    private static class RCTVideoView extends VideoView implements LifecycleEventListener,
            MediaPlayer.OnPreparedListener,
            MediaPlayer.OnCompletionListener,
            MediaPlayer.OnErrorListener,
            MediaPlayer.OnInfoListener,
            MediaPlayer.OnBufferingUpdateListener,
            Runnable{

        private Handler mHandler;

        public RCTVideoView(ThemedReactContext reactContext) {
            super(reactContext);
            reactContext.addLifecycleEventListener(this);
            setOnPreparedListener(this);
            setOnCompletionListener(this);
            setOnErrorListener(this);
            mHandler = new Handler();
        }

        @Override
        public void onHostResume() {
            FLog.e(VideoViewManager.class,"onHostResume");
        }

        @Override
        public void onHostPause() {
            FLog.e(VideoViewManager.class,"onHostPause");
            pause();
        }

        @Override
        public void onHostDestroy() {
            FLog.e(VideoViewManager.class,"onHostDestroy");
            mHandler.removeCallbacks(this);
        }

        @Override
        public void onPrepared(MediaPlayer mp) {//视频加载成功准备播放
            int duration = mp.getDuration();
            FLog.e(VideoViewManager.class,"onPrepared duration = "+duration);
            mp.setOnInfoListener(this);
            mp.setOnBufferingUpdateListener(this);
            WritableMap event = Arguments.createMap();
            event.putInt("duration",duration);//key用于js中的nativeEvent
            dispatchEvent(VideoEvent.EVENT_PREPARE.toString(),event);
            mHandler.post(this);
        }

        @Override
        public void onCompletion(MediaPlayer mp) {//视频播放结束
            FLog.e(VideoViewManager.class,"onCompletion");
            dispatchEvent(VideoEvent.EVENT_COMPLETION.toString(),null);
            mHandler.removeCallbacks(this);
            int progress = getDuration();
            WritableMap event = Arguments.createMap();
            event.putInt("progress",progress);
            dispatchEvent(VideoEvent.EVENT_PROGRESS.toString(),event);
        }

        @Override
        public boolean onError(MediaPlayer mp, int what, int extra) {//视频播放出错
            FLog.e(VideoViewManager.class,"onError what = "+ what+" extra = "+extra);
            mHandler.removeCallbacks(this);
            WritableMap event = Arguments.createMap();
            event.putInt("what",what);
            event.putInt("extra",what);
            dispatchEvent(VideoEvent.EVENT_ERROR.toString(),event);
            return true;
        }

        @Override
        public boolean onInfo(MediaPlayer mp, int what, int extra) {
            FLog.e(VideoViewManager.class,"onInfo");
            switch (what) {
                /**
                 * 开始缓冲
                 */
                case MediaPlayer.MEDIA_INFO_BUFFERING_START:
                    FLog.e(VideoViewManager.class,"开始缓冲");
                    break;
                /**
                 * 结束缓冲
                 */
                case MediaPlayer.MEDIA_INFO_BUFFERING_END:
                    FLog.e(VideoViewManager.class,"结束缓冲");
                    break;
                /**
                 * 开始渲染视频第一帧画面
                 */
                case MediaPlayer.MEDIA_INFO_VIDEO_RENDERING_START:
                    FLog.e(VideoViewManager.class,"开始渲染视频第一帧画面");
                    break;
                default:
                    break;
            }
            return false;
        }

        @Override
        public void onBufferingUpdate(MediaPlayer mp, int percent) {//视频缓冲进度
            FLog.e(VideoViewManager.class,"onBufferingUpdate percent = "+percent);
            int buffer = (int) Math.round((double) (mp.getDuration() * percent) / 100.0);
            WritableMap event = Arguments.createMap();
            event.putInt("buffer",buffer);
            dispatchEvent(VideoEvent.EVENT_UPDATE.toString(),event);
        }

        @Override
        public void run() {
            int progress = getCurrentPosition();
            WritableMap event = Arguments.createMap();
            event.putInt("progress",progress);
            dispatchEvent(VideoEvent.EVENT_PROGRESS.toString(),event);
            mHandler.postDelayed(this,1000);
        }

        private void dispatchEvent(String eventName,WritableMap eventData){
            ReactContext reactContext = (ReactContext) getContext();
            reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                    getId(),//native和js两个视图会依据getId()而关联在一起
                    eventName,//事件名称
                    eventData
            );
        }
    }
}
