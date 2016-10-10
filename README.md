# XiFan
一个使用react native实现的韩剧影视APP。该项目是本人在学习react native 过程中写的，项目很小，但是麻雀虽小五脏俱全，
项目中运用了react native的很多知识，从中你可以学习到

- View\Text\Image\ViewPager\Navigator\TouchableOpacity等控件的使用
- 如何动态渲染\添加组件
- 应用的页面跳转
- TabView选项卡的实现
- 原生自定义模块开发（RN调用原生横竖屏设置）
- 原生自定义UI组件开发（RN调用原生播放器VideoView）

更多信息请访问 [我的博客](http://blog.csdn.net/it_talk),博客里有该项目的实战系列教程。

![效果图](https://github.com/helengray/XiFan/raw/master/xifan.gif)

## 注意
node_modules 没有上传，要自己执行npm install。

用到的module：
- react@15.2.1
- react-native@0.31.0
- cheerio@0.20.0
- events@1.1.1

## 运行项目
将项目clone下来后，cmd命令行切到项目根目录下，执行命令

```
npm install react@15.2.1
```
```
npm install react-native@0.31.0
```
```
npm install cheerio@0.20.0
```
```
npm install events@1.1.1
```

module安装完之后，执行运行命令,记得android模拟器要连接着，并配置Debug server host & port for device的IP端口

```
react-native run-android
```

## TODO
目前项目只支持Android，将来可能会适配IOS
