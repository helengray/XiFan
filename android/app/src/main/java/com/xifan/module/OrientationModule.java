package com.xifan.module;

import android.app.Activity;
import android.content.pm.ActivityInfo;
import android.view.Window;
import android.view.WindowManager;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.common.MapBuilder;

import java.util.Map;

import javax.annotation.Nullable;

/**
 * Created by Helen on 2016/8/23.
 * 应用的横竖屏切换
 */
/*package*/ class OrientationModule extends ReactContextBaseJavaModule{
    private static final String ORIENTATION_LANDSCAPE_KEY = "LANDSCAPE";//横屏
    private static final String ORIENTATION_PORTRAIT_KEY = "PORTRAIT";//竖屏

    public OrientationModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "Orientation";
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {//定义返回值
        Map<String,Object> constants = MapBuilder.newHashMap();
        constants.put(ORIENTATION_LANDSCAPE_KEY, ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
        constants.put(ORIENTATION_PORTRAIT_KEY, ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        constants.put("initOrientation",getReactApplicationContext().getResources().getConfiguration().orientation);
        return constants;
    }

    @ReactMethod
    public void setOrientation(final int orientation){
        UiThreadUtil.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Activity activity = getCurrentActivity();
                if(activity == null){
                    return;
                }
                if(orientation == ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE){
                    activity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
                    //设置全屏
                    Window window = activity.getWindow();
                    WindowManager.LayoutParams params = window.getAttributes();
                    params.flags |= WindowManager.LayoutParams.FLAG_FULLSCREEN;
                    window.setAttributes(params);

                }else if(orientation == ActivityInfo.SCREEN_ORIENTATION_PORTRAIT){
                    activity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
                    //设置非全屏
                    Window window = activity.getWindow();
                    WindowManager.LayoutParams params = window.getAttributes();
                    params.flags &= (~WindowManager.LayoutParams.FLAG_FULLSCREEN);
                    window.setAttributes(params);
                }
            }
        });

    }
    @ReactMethod
    public void getRequestedOrientation(Callback callback){
        int orientation = getReactApplicationContext().getResources().getConfiguration().orientation;
        callback.invoke(orientation);
    }
}
