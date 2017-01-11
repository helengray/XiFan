package com.xifan;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.xifan.module.XFLocalPackage;

import org.pgsqlite.SQLitePluginPackage;

import java.io.File;
import java.util.Arrays;
import java.util.List;

import javax.annotation.Nullable;

import cn.bmob.v3.Bmob;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
              new MainReactPackage(),
              new XFLocalPackage(),
              new SQLitePluginPackage()
      );
    }

    @Nullable
    @Override
    protected String getJSBundleFile() {
      File bundleFile = new File(getCacheDir()+"/react_native","index.android.bundle");
      if(bundleFile.exists()){
        System.out.println("getJSBundleFile path = "+bundleFile.getAbsolutePath());
        return bundleFile.getAbsolutePath();
      }
      return super.getJSBundleFile();
    }

    @Nullable
    @Override
    protected String getBundleAssetName() {
      return super.getBundleAssetName();
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this,false);
    Bmob.initialize(this, "17f3691896888c3cff0f35a7754ce1df");
  }
}
