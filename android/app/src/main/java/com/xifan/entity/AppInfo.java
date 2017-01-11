package com.xifan.entity;

import cn.bmob.v3.BmobObject;
import cn.bmob.v3.datatype.BmobFile;

/**
 * Created by 李晓伟 on 2017/1/4.
 *
 */
public class AppInfo extends BmobObject{
    private String version;//bundle版本
    private String updateContent;//更新内容
    private Boolean immediately;//bundle是否立即生效
    private BmobFile bundle;//要下载的bundle文件

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getUpdateContent() {
        return updateContent;
    }

    public void setUpdateContent(String updateContent) {
        this.updateContent = updateContent;
    }

    public BmobFile getBundle() {
        return bundle;
    }

    public void setBundle(BmobFile bundle) {
        this.bundle = bundle;
    }

    public boolean isImmediately() {
        if(immediately == null){
            return false;
        }
        return immediately;
    }

    public void setImmediately(boolean immediately) {
        this.immediately = immediately;
    }

    @Override
    public String toString() {
        return "AppInfo{" +
                "version='" + version + '\'' +
                ", updateContent='" + updateContent + '\'' +
                ", immediately=" + immediately +
                ", bundle=" + bundle +
                '}';
    }
}
