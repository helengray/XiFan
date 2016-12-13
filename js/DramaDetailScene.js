import React,{Component} from 'react';
import {
	View,
	Text,
	StyleSheet,
	Image,
	RefreshControl,
	ScrollView,
	TouchableOpacity,
	ViewPagerAndroid,
	Picker,
	ToastAndroid,
	TouchableWithoutFeedback,
	InteractionManager
} from 'react-native';
import Cheerio from 'cheerio-without-node-native';
import TitleBar from './component/TitleBarComponent.android';
import VideoPlayScene from './VideoPlayScene';
import SQLite from './db/SQLite';
var sqlite = new SQLite();
import Movie from './db/Movie';
import History from './db/History';
const HOST_URL = 'http://m.y3600.com/78/';
//this.state={
// 	tabIndex:0,
// 	desc:'',//简介
// 	playList:[
// 	  [
// 		{
// 			text:第01集,
// 			method:"ck_yk('CNTM0MTMzMg==')"
// 		}
// 	  ],[]...
// 	],
// 	sourceList:[],//来源列表
// 	currSource:0,//当前来源列表索引
// 	hasStart:false,//是否已经开播
//}

export default class DramaDetailScene extends Component{

	constructor(props){
		super(props);
		this.state={
			isCollection:false,
			tabIndex:0,
			loaded:false,
			desc:'',//简介
			playList:[],
			sourceList:[],//来源列表
			currSource:0,//当前来源列表索引
			hasStart:false,//是否已经开播
			currPlayList:[],//当前播放的集数，对应到来源列表
		}
	}

	componentDidMount(){
		InteractionManager.runAfterInteractions(()=>{
			this._fetchData(this.props.data.url);
		});
	}


	_fetchData(url){
		var s = url.split("/");
		url = HOST_URL+s[s.length-1];
//console.log('request url = '+url);
		fetch(url)
			.then((resp) => resp.text())
			.then((result) => {
				var desc = '';
				var playList = [];
				var hasStart = false;
				var sourceList = [];
				var currPlayList = [];
//console.log('result = '+result);
				var $ = Cheerio.load(result);
				/**解析简介*/
				var p = $('ul.content').find('p');
				
				p.each((index,item)=>{//获取简介详情
					var text = $(item).text();
					if(text != ''){
						desc=desc+text+"\n";
					}
					
				});
				/**解析来源*/
				var as = $('ul.online').find('h4').find('span').find('a');
				if(as){
					as.each((index,item)=>{
						sourceList.push($(item).text());
						currPlayList.push(0);
					})
				}
console.log('_fetchData currPlayList = '+JSON.stringify(currPlayList));
				/**解析集数*/
				
				//多种来源
				//[[],[],[]]
				var ul = $('div#playlist').find('ul');
				if(ul && ul.length > 0){
					hasStart = true;
					ul.each((index,item)=>{
						var ulItem=[];
						var li = $(item).find('li');
						if(li && li.length>0){//来源里面的集数列表
							li.each((i,m)=>{
								var info = {
									text:$(m).text(),
									method:$(m).find('a').attr('onclick'),
								};
//console.log('info = '+JSON.stringify(info));
								ulItem.push(info);
							});
							//排序
							//ulItem.sort((a,b)=>{return a>b});
							playList.push(ulItem);
						}
					});
				}else{
					hasStart = false;
					ul = $('ul.coming');
					ul.find('h5').remove();
					playList.push($(ul).text());
				}
				
				//获取观看历史
                sqlite.findHistoryByName(this.props.data.name).then((result)=>{
                    var currSource = result.sourceIndex;
                    var currPlayList = this.state.currPlayList;
                    currPlayList[currSource] = result.indexPlay;
					sqlite.findCollectionByName(this.props.data.name).then((result)=>{
						var isCollection = false;
						if(result){
							isCollection = true;
						}
						this.setState({
							desc:desc,
							playList:playList,
							hasStart:hasStart,
							sourceList:sourceList,
							currPlayList:currPlayList,
							loaded:true,
							currSource:currSource,
							isCollection:isCollection,
						});
					}).catch((err)=>{
						this.setState({
							desc:desc,
							playList:playList,
							hasStart:hasStart,
							sourceList:sourceList,
							currPlayList:currPlayList,
							loaded:true,
							currSource:currSource,
							isCollection:false,
						});
					});
                }).catch((e)=>{
					sqlite.findCollectionByName(this.props.data.name).then((result)=>{
						var isCollection = false;
						if(result){
							isCollection = true;
						}
						this.setState({
							desc:desc,
							playList:playList,
							hasStart:hasStart,
							sourceList:sourceList,
							currPlayList:currPlayList,
							loaded:true,
							isCollection:isCollection,
						});
					}).catch((err)=>{
						this.setState({
							desc:desc,
							playList:playList,
							hasStart:hasStart,
							sourceList:sourceList,
							currPlayList:currPlayList,
							loaded:true,
							isCollection:false,
						});
					});

                });

			})
			.done();
	}
	/**剧集列表空界面*/
	_getPlayListEmptyView(text){
		return (<Text key='0' style={{padding:10,fontSize:14}}>{text}</Text>);
	}
	/**剧集列表界面*/
	_getPlayListView(key,text,currPlayIndex){
		return (
			<TouchableOpacity 
			key={key} 
			style={currPlayIndex==key?styles.buttonSelect:styles.buttonUnSelect} 
			activeOpacity={0.8}
			onPress={this._onPlayButtonPress.bind(this,key)}
			>
				<Text style={{color:'black',fontSize:12}}>{text}</Text>
			</TouchableOpacity>
			);
	}
	/**集数按钮点击事件*/
	_onPlayButtonPress(index){
		var currSource = this.state.currSource;
		var currPlayList = this.state.currPlayList;
		currPlayList[currSource] = index;
		this.setState({
            currPlayList:currPlayList,
		});
		var playList = this.state.playList[currSource];
		var playInfo = playList[index];
		this._play(playInfo);
		this._saveHistory(currSource,index,playInfo.text);
	}

	_play(playInfo){
		console.log('playInfo ='+JSON.stringify(playInfo));
		var method = playInfo.method;
		
		var methodFlag = this._getMethodFlag(method);
		var idFlag = this._getIdFlag(method);
		
		if(methodFlag && idFlag){
			var id = this._getId(idFlag);
console.log('method = '+methodFlag);
console.log('id = '+id);
			switch (methodFlag){
				case 'd_bi':
					this._d_bi(id);
					break;
				case 'ck_yk':
					this._ck_yk(id);
					break;
				case 'yk_d':
					this._yk_d(id);
					break;
				case 't_hn':
				case 't_hn1':
					this._t_hn(id);
					break;
				case 'ai_q':
				case 'ai_u':
					this._ai_q(id);
					break;
				case 'ck_m':
				case 'ck_d':
					this._ck_m(id);
					break;
				case 'd_ac':
					this._d_ac(id);
					break;
				default :
					ToastAndroid.show('赞不支持播放',ToastAndroid.SHORT);
				break;
			}
		}else{
			//弹提示'播放地址错误'
		}
	}
	/**获取方法名*/
	_getMethodFlag(method){
		var i = method.indexOf("(");
		if(i != -1){
			return method.substring(0,i);
		}
		return ;
	}
	/**获取方法参数*/
	_getIdFlag(method){
		var start = method.indexOf("(");
		var end = method.indexOf(")");
		if(start != -1 && end != -1){
			var params = method.substring(start+1,end);
			return params.split(',')[0];
		}
	}
	/**去掉参数字符引号*/
	_getId(idFlag){
		console.log('idFlag = '+idFlag);
		return idFlag.replace("'","").replace("'","");
	}
	/**哔哩哔哩*/
	_d_bi(id){
		var strs = id.split('&');
		var url = 'http://www.bilibili.com/mobile/video/av'+strs[0]+'.html#'+strs[1];
		this._goVideoPlay('bili',url);
	}
	/**优酷*/
	_ck_yk(id){
		var url = 'http://p.y3600.com/yk/'+id+'&m=1&1.html'
		this._goVideoPlay('yk',url);
	}
	_yk_d(id){
		var url = 'http://v.youku.com/v_show/id_'+id+'.html';
		this._goVideoPlay('yk_d',url);
	}
	/**土豆*/
	_t_hn(id){
		// if(id.indexOf('&icode=')==-1){
		// 	id = id+'&icode='+id;
		// }
		// var url = 'https://p1.y3600.com/td/'+id+'&1.html';
		var index = id.indexOf('&icode=');
		if(index != -1){
			id = id.substring(0,index);
		}
		var url = 'http://www.tudou.com/programs/view/html5embed.action?code='+id;
		this._goVideoPlay('td',url);
	}
	/**爱奇艺*/
	_ai_q(id){
		var url = 'http://m.iqiyi.com/shareplay.html?vid='+id;
		this._goVideoPlay('ai_q',url);
	}

	_ck_m(id){
		var url = 'https://p1.y3600.com/le/'+id+'&1.html';
		this._goVideoPlay('ck_m',url);
	}

	_ai_u(method){
		var start = method.indexOf("(");
		var end = method.indexOf(")");
		if(start != -1 && end != -1){
			var params = method.substring(start+1,end);
			var url = params.split(',')[1];
			this._goVideoPlay('ai_u',url);
		}
	}

	_d_ac(id){
		var url = 'https://p1.y3600.com/ac/'+id+'&1.html';//'http://m.acfun.tv/ykplayer?date=undefined#vid='+id;
		this._goVideoPlay('d_ac',url);
	}

	_goVideoPlay(type,url){
console.log('video player url = '+url);
		this.props.navigator.push({
			id:'VideoPlayScene',
			name:'',
			data:{
				type:type,
				url:url,
			},
			component:VideoPlayScene,
		});
	}

	/**获取来源下拉框选项view*/
	_getSourceListItemView(key,label){
		return(<Picker.Item key={key} label={label} value={key}/>);
	}

	/**获取来源界面*/
	_getSourceListView(itemViews){
		if(itemViews && itemViews.length > 0){
			return(
				<Picker
					style={{flex:1,height:40}}
					selectedValue={this.state.currSource}
					onValueChange={(itemValue,itemPosition)=>{
//console.log('value='+itemValue+' position='+itemPosition);
						this.setState({
							currSource:itemPosition,
						});
					}}
					mode={'dropdown'}
					>
					{itemViews}
				</Picker>
				);
		}else{
			return(<Text style={{flex:1,fontSize:12}}>未知</Text>);
		}
	}

	//加载中页面
	_renderLoadingView(){
	    return(
	    	<View style={styles.container}>
				<TitleBar title={this.props.name} subtitle='' subScene={true} navigator={this.props.navigator}/>
		        <View style = {{flex:1,justifyContent:'center',alignItems:'center'}}>
		        	<Text>加载中，请稍后...</Text>
		        </View>
		    </View>
	      );
  	}

	render(){

		if(!this.state.loaded){
			return this._renderLoadingView();
		}
		//来源view
		var sourceList = this.state.sourceList;
		var sourceListView;
		var sourceListItemViews = [];
		for (var i = 0; i < sourceList.length; i++) {
			sourceListItemViews.push(this._getSourceListItemView(i,sourceList[i]));
		}
		sourceListView = this._getSourceListView(sourceListItemViews);
		
		//集数列表view
		var playListViews =[];
		var playList = this.state.playList;
		if(!this.state.hasStart){
			playListViews.push(this._getPlayListEmptyView(playList[0]));
		}else{
			try{
				var currSource = this.state.currSource;
				playList = playList[currSource];
				var currPlay = this.state.currPlayList[currSource];
				for (var i = 0; i < playList.length; i++) {
					playListViews.push(this._getPlayListView(i,playList[i].text,currPlay));
				}
			}catch(e){

			}
		}
		
		return(
			<View style={styles.container}>
				<TitleBar title={this.props.name} subtitle='' subScene={true} navigator={this.props.navigator}/>
				<View style={styles.topContainer}>
					<Image style={styles.image} source={{uri:this.props.data.pic}}/>
					<View style={styles.topRightContainer}>
						<Text style={{fontSize:12}}>更新至：{this.props.data.title}</Text>
						<View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:5}}>
							<Text style={{fontSize:12}} >来源：</Text>
							{sourceListView}
						</View>
						<View style={{flexDirection:'row',alignItems:'center',marginTop:30,}}>
							<TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={this._onPlayVideoPress.bind(this)}>
								<Image style={{height:18,width:18}} source={require('../img/icon_video_play.png')}/>
								<Text style={{color:'white',fontSize:14}}>播放</Text>
							</TouchableOpacity>
							<TouchableWithoutFeedback onPress={this._onCollectionPress.bind(this,this.props.data)}>
								<Image
									style={{height:25,width:25,marginLeft:12}}
									source={this.state.isCollection?require('../img/icon_collection_true.png'):require('../img/icon_collection_normal.png')}/>
							</TouchableWithoutFeedback>
						</View>
					</View>
				</View>
				<View style={styles.centerContainer}>
					<View style={{flex:1}}>
						<TouchableOpacity style={styles.tabItem} activeOpacity={0.6} onPress={this._onTabPress.bind(this,0)}>
							<Text style={this.state.tabIndex==0?styles.tabTextSelect:styles.tabTextUnSelect}>剧集</Text>
						</TouchableOpacity>

						<View style={this.state.tabIndex==0?styles.tabUnderlineSelect:styles.tabUnderlineUnSelect}/>
					</View>
					<View style={{flex:1}}>
						<TouchableOpacity style={styles.tabItem} activeOpacity={0.6} onPress={this._onTabPress.bind(this,1)}>
							<Text style={this.state.tabIndex==0?styles.tabTextUnSelect:styles.tabTextSelect}>简介</Text>
						</TouchableOpacity>
						<View style={this.state.tabIndex==0?styles.tabUnderlineUnSelect:styles.tabUnderlineSelect}/>
					</View>
				</View>
				<View style={styles.bottomContainer}>
					<ViewPagerAndroid 
						style={{flex:1}} 
						initialPage={0} 
						scrollEnabled={true}
						onPageSelected={this._onPageSelected.bind(this)}
						ref={(viewPager)=>{this.viewPager = viewPager}}
						>
						<View style={{flex:1}}>
							<ScrollView>
								<View style={{flex:1,flexDirection:'row',flexWrap:'wrap',padding:5}}>
									{playListViews}
								</View>
								
							</ScrollView>
						</View>
						<View style={{flex:1}}>
							<ScrollView>
								<Text style={{padding:5,fontSize:14}}>{this.state.desc}</Text>
							</ScrollView>
						</View>
					</ViewPagerAndroid>
				</View>
			</View>
			);
	}

	_onTabPress(index){
		if(index != this.state.tabIndex){
			this.viewPager.setPage(index);
			this.setState({
				tabIndex:index,
			});
		}
	}

	_onPageSelected(event){
		const position = event.nativeEvent.position;
		this.setState({
			tabIndex:position,
		});
	}
	//播放按钮点击事件
	_onPlayVideoPress(){
		var currSource = this.state.currSource;
		var currPlayList = this.state.currPlayList;
		if(currSource < currPlayList.length){
			var index = currPlayList[currSource];
			var playList = this.state.playList[currSource];
			if(index < playList.length){
				var playInfo = playList[index];
				this._play(playInfo);
				this._saveHistory(currSource,index,playInfo.text);
			}else {
				ToastAndroid.show("暂无播放信息",ToastAndroid.SHORT);
			}
		}else {
			ToastAndroid.show("暂无播放信息",ToastAndroid.SHORT);
		}
	}
	//收藏
	_onCollectionPress(movie){
		/*{ name: '信义',
			title: '全集中字',
			actor: '金喜善,李敏镐,刘德焕,朴世英,李必立,沈恩京,成勋,李民浩',
			pic: 'http://img.y3600.com/d/file/p/2016/10/26/40d39df617fc663a21f1e433e67742de.jpg',
			url: '/hanju/2016/958.html' }*/
		var isCollection = !this.state.isCollection;
		if(isCollection){//保存
			var coll = new Movie();
			coll.setName(movie.name);
			coll.setActor(movie.actor);
			coll.setPic(movie.pic);
			coll.setUrl(movie.url);
			coll.setTitle(movie.title);
			var date = new Date();
			var time=date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' ';
			var hours = date.getHours();
			if(hours < 9){
				time = time+'0'+hours+':';
			}else {
				time = time+hours+':';
			}
			var minutes = date.getMinutes();
			if(minutes < 9){
				time = time+'0'+minutes+':';
			}else {
				time = time+minutes+':';
			}
			var sec = date.getSeconds();
			if(sec < 9){
				time = time+'0'+sec;
			}else {
				time = time+sec;
			}
			coll.setTime(time);
			sqlite.saveCollection(coll).then(()=>{
				ToastAndroid.show('收藏成功',ToastAndroid.SHORT);
				this.setState({
					isCollection:isCollection,
				});
			}).catch((e)=>{
				ToastAndroid.show('收藏失败',ToastAndroid.SHORT);
			}).done();
		}else {//删除
			sqlite.deleteCollectionByName(this.props.data.name).then(()=>{
				ToastAndroid.show('取消收藏成功',ToastAndroid.SHORT);
				this.setState({
					isCollection:isCollection,
				})
			}).catch((e)=>{
				ToastAndroid.show('取消收藏失败',ToastAndroid.SHORT);
			}).done();
		}
	}

	_saveHistory(currSource,currIndex,text){
		var movie = this.props.data;
		var history = new History();
		history.setTitle(movie.title);
		history.setName(movie.name);
		history.setUrl(movie.url);
		history.setPic(movie.pic);
		var date = new Date();
		var time=date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' ';
		var hours = date.getHours();
		if(hours < 9){
			time = time+'0'+hours+':';
		}else {
			time = time+hours+':';
		}
		var minutes = date.getMinutes();
		if(minutes < 9){
			time = time+'0'+minutes+':';
		}else {
			time = time+minutes+':';
		}
		var sec = date.getSeconds();
		if(sec < 9){
			time = time+'0'+sec;
		}else {
			time = time+sec;
		}
		history.setTime(time);
		history.setSourceIndex(currSource);
		history.setIndexPlay(currIndex);
		history.setIndexName(text);
		sqlite.saveHistory(history).then(()=>{

		}).catch((e)=>{

		});
	}
}

var styles = StyleSheet.create({
	container:{
		flex:1,
		flexDirection:'column',
	},
	topContainer:{
		height:150,
		flexDirection:'row',
		padding:15
	},
	topRightContainer:{
		flex:1,
		flexDirection:'column',
		marginLeft:10,
		marginTop:5,
		marginBottom:5,
	},
	image:{
		height:120,
		width:100,
		resizeMode:Image.resizeMode.strech,
	},
	centerContainer:{
		height:45,
		flexDirection:'row',
		justifyContent:'center',
		backgroundColor:'white',
		alignItems:'center',
	},
	tabItem:{
		flex:1,
		justifyContent:'center',
		alignItems:'center',
	},
	tabTextSelect:{
		textAlign:'center',
		color:'#ff5722',
	},
	tabTextUnSelect:{
		textAlign:'center',
		color:'#d5d5d5',
	},
	tabUnderlineSelect:{
		height:2,
		backgroundColor:'#ff5722',
	},
	tabUnderlineUnSelect:{
		height:2,
	},
	bottomContainer:{
		flex:1,
	},
	button:{
		flexDirection:'row',
		width:60,
		height:25,
		backgroundColor:'#ff5722',
		justifyContent:'center',
		alignItems:'center',
		borderRadius:10,
		borderWidth:1,
		borderColor:'transparent',
	},
	buttonSelect:{
		height:25,
		backgroundColor:'white',
		justifyContent:'center',
		alignItems:'center',
		borderRadius:4,
		borderWidth:1,
		borderColor:'#ff5722',
		marginTop:5,
		marginBottom:5,
		marginLeft:5,
		marginRight:5,
		padding:4
	},
	buttonUnSelect:{
		height:25,
		backgroundColor:'#f5f5f5',
		justifyContent:'center',
		alignItems:'center',
		borderRadius:4,
		borderWidth:1,
		borderColor:'#eeeeee',
		marginTop:5,
		marginBottom:5,
		marginLeft:5,
		marginRight:5,
		padding:4,
	}
});