package com.xifan.module;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.text.TextUtils;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.common.MapBuilder;
import com.xifan.BuildConfig;
import com.xifan.entity.AppInfo;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import javax.annotation.Nullable;

import cn.bmob.v3.BmobQuery;
import cn.bmob.v3.datatype.BmobFile;
import cn.bmob.v3.exception.BmobException;
import cn.bmob.v3.listener.DownloadFileListener;
import cn.bmob.v3.listener.FindListener;

/**
 * Created by 李晓伟 on 2017/1/11.
 * 版本检测更新
 */
/*package*/ class UpdateCheckModule extends ReactContextBaseJavaModule {
    private static final String TAG = "UpdateCheckModule";
    private static final String BUNDLE_VERSION = "CurrentBundleVersion";
    private SharedPreferences mSP;

    UpdateCheckModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mSP = reactContext.getSharedPreferences("react_bundle", Context.MODE_PRIVATE);
    }

    @Override
    public String getName() {
        return "UpdateCheck";
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        Map<String,Object> constants = MapBuilder.newHashMap();
        //跟随apk一起打包的bundle基础版本号,也就是assets下的bundle版本号
        String bundleVersion = BuildConfig.BUNDLE_VERSION;
        //bundle更新后的当前版本号
        String cacheBundleVersion = mSP.getString(BUNDLE_VERSION,"");
        if(!TextUtils.isEmpty(cacheBundleVersion)){
            bundleVersion = cacheBundleVersion;
        }
        constants.put(BUNDLE_VERSION,bundleVersion);
        return constants;
    }


    @ReactMethod
    public void check(String currVersion){
        log("+++++check version+++++"+currVersion);
        if(currVersion.equals(mSP.getString(BUNDLE_VERSION,""))){
            log("已经是最新版本");
            return;
        }
        BmobQuery<AppInfo> query = new BmobQuery<>();
        query.setLimit(1);
        query.addWhereGreaterThan("version",currVersion);
        query.findObjects(new FindListener<AppInfo>() {
            @Override
            public void done(List<AppInfo> list, BmobException e) {
                if(e == null){
                    if(list!=null && !list.isEmpty()){
                        final AppInfo info = list.get(0);
                        File reactDir = new File(getReactApplicationContext().getCacheDir(),"react_native");
                        //获取到更新消息，说明bundle有新版，在解压前先删除掉旧版
                        deleteDir(reactDir);
                        if(!reactDir.exists()){
                            reactDir.mkdirs();
                        }
                        final File saveFile = new File(reactDir,"bundle-patch.zip");
                        BmobFile patchFile = info.getBundle();
                        //下载bundle-patch.zip文件
                        patchFile.download(saveFile, new DownloadFileListener() {
                            @Override
                            public void done(String s, BmobException e) {
                                if (e == null) {
                                    log("下载完成");
                                    //解压patch文件到react_native文件夹下
                                    boolean result = unzip(saveFile);
                                    if(result){//解压成功后保存当前最新bundle的版本
                                        mSP.edit().putString(BUNDLE_VERSION,info.getVersion()).apply();
                                        if(info.isImmediately()) {//立即加载bundle
                                            Activity currActivity = getCurrentActivity();
                                            if(currActivity != null){
                                                ((ReactApplication) currActivity.getApplication()).getReactNativeHost().clear();
                                                currActivity.recreate();
                                            }
                                        }
                                    }else{//解压失败应该删除掉有问题的文件，防止RN加载错误的bundle文件
                                        File reactDir = new File(getReactApplicationContext().getCacheDir(),"react_native");
                                        deleteDir(reactDir);
                                    }
                                } else {
                                    e.printStackTrace();
                                    log("下载bundle patch失败");
                                }

                            }

                            @Override
                            public void onProgress(Integer per, long size) {

                            }
                        });
                    }else{
                        log("已经是最新版本");
                    }
                }else{
                    e.printStackTrace();
                    log("获取版本信息失败");
                }
            }
        });
    }

    private static boolean unzip(File zipFile){
        if(zipFile != null && zipFile.exists()){
            ZipInputStream inZip = null;
            try {
                inZip = new ZipInputStream(new FileInputStream(zipFile));
                ZipEntry zipEntry;
                String entryName;
                File dir = zipFile.getParentFile();
                while ((zipEntry = inZip.getNextEntry()) != null) {
                    entryName = zipEntry.getName();
                    if (zipEntry.isDirectory()) {
                        File folder = new File(dir,entryName);
                        folder.mkdirs();
                    } else {
                        File file = new File(dir,entryName);
                        file.createNewFile();

                        FileOutputStream fos = new FileOutputStream(file);
                        int len;
                        byte[] buffer = new byte[1024];
                        while ((len = inZip.read(buffer)) != -1) {
                            fos.write(buffer, 0, len);
                            fos.flush();
                        }
                        fos.close();
                    }
                }
                log("+++++解压完成+++++");
                return true;
            } catch (IOException e) {
                e.printStackTrace();
                log("+++++解压失败+++++");
                return false;
            }finally {
                try {
                    if(inZip != null){
                        inZip.close();
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

        }else {
            return false;
        }
    }

    /**
     * 删除dir目录下的所有文件
     */
    private static void deleteDir(File dir){
        if (dir==null||!dir.exists()) {
            return;
        } else {
            if (dir.isFile()) {
                dir.delete();
                return;
            }
        }
        if (dir.isDirectory()) {
            File[] childFile = dir.listFiles();
            if (childFile == null || childFile.length == 0) {
                dir.delete();
                return;
            }
            for (File f : childFile) {
                deleteDir(f);
            }
            dir.delete();
        }
    }

    private static void log(String msg){
        Log.d(TAG,msg);
    }
}
