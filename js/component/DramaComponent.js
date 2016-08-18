import React,{Component} from 'react';
import {
	View,
	Text,
	StyleSheet,
	ListView,
	Image,
	RefreshControl,
	Dimensions,
	TouchableOpacity,
	ToolbarAndroid,
} from 'react-native';
import Cheerio from 'cheerio';
import DramaDetailScene from '../DramaDetailScene';

const HOST_URL = 'http://www.y3600.com';
const WIN_WIDTH = Dimensions.get('window').width;
const WIN_HEIGHT = Dimensions.get('window').height;

export default class DramaComponent extends Component{

	constructor(props){
		super(props);
		this.state = {
			movies:new ListView.DataSource({
				rowHasChanged:(r1,r2) => r1!=r2,
			}),
			loaded:false,
			isRefreshing:false,//是否下拉刷新
			dramaList:{
				totalPage:1,//总页数
				currPage:0,//当前页
				pages:[{index:1,url:this.props.url}],
				datas:[],
				hasPage:false,//是否有分页
			},
		}
	}

	//组件开始渲染render之前被调用。
	//作用相当于Fragment生命周期中的onCreate方法。
	componentWillMount(){

	}

	//在最初的render方法调用之后立即调用。
	//网络请求、事件订阅等操作可以在这个方法中调用。 
	//作用相同与Fragment生命周期中的onViewCreate方法。
	componentDidMount(){
		this.fetchData(this.props.url);
	}

	//接收更新之后的props。 
	//如果props没有更新，此方法不调用。
	componentWillReceiveProps(nextProps){
		//console.log('this.props'+this.props.url);
		//console.log('props'+props.url);
		var newUrl = nextProps.url;
		var oldUrl = this.props.url;
		if(oldUrl!= newUrl){
			this.setState({
				loaded:true,
				isRefreshing:true,
				dramaList:{
					totalPage:1,//总页数
					currPage:0,//当前页
					pages:[{index:1,url:newUrl}],
					datas:[],
					hasPage:false,//是否有分页
				},
			});
			this.fetchData(newUrl);
		}
	}

	//当state的值有变化时，先执行此方法，此返回值为true/false，判断是否执行更新操作，即是否执行render渲染
	// shouldComponentUpdate(nextProps,nextState){
	// 	return true;
	// }
	
	//执行更新render方法之前需要做的处理。
	componentWillUpdate(nextProps,nextState){

	}

	//组件的更新已同步到DOM中，可以进行DOM操作
	componentDidUpdate(prevProps,prevState){

	}

	//组件生命周期的最后一步，组件将走到生命的尽头，这是我们需要做一些回收的工作。 
	//如取消事件绑定，关闭网络连接等操作。
	componentWillUnMount (){

	}
	

	//获取数据并解析
	fetchData(url){
		url = HOST_URL+url;
//console.log('request url = '+url);
		fetch(url)
			.then((resp) => resp.text())
			.then((result) => {
				var $ = Cheerio.load(result);
				var body = $('div.m-ddone').find('ul');//ui

				var dramaList = this.state.dramaList;
				//console.log('datas length 1= '+dramaList.datas.length);
				if(this.state.isRefreshing){
					dramaList.currPage = 0;
					dramaList.datas = [];
				}
				dramaList.currPage++;
				//获取页数数据
				if(!dramaList.hasPage){
					dramaList.hasPage = true;
					var page = $('div.pages').find('a');
					page.each((i,item)=>{
						if(!$(item).hasClass('next')){
							dramaList.totalPage++;
							dramaList.pages.push({
								index:$(item).text(),
								url:$(item).attr('href'),
							});
						}
					});
				}

				body.each((index,item)=>{//li
					var dramaItem ={
						name:'',//影片名称
						title:'',//标题
						actor:'',//演员
						pic:'',//图片地址
						url:'',//详情链接
					};
					var link = $(item).find('a');
					link.each((i,a)=>{//获取影片名称
						var aTag = $(a);
						if(i===0){
							dramaItem.pic = aTag.find('img').attr('src');
							dramaItem.url = aTag.attr('href');
							dramaItem.title = aTag.find('label.tit').text();
						}else if(i===1){
							//console.log('item = '+aTag.text());
							dramaItem.name = aTag.text();
						}
						
					});

					var actor = $(item).find('li.zyy').text();
					//console.log('renwu = '+actor);
					dramaItem.actor = actor;
					
					//
					dramaList.datas.push(dramaItem);
				});
				console.log('datas length 2= '+dramaList.datas.length);
				this.setState({
					movies:this.state.movies.cloneWithRows(dramaList.datas),
					loaded:true,
					isRefreshing:false,
					dramaList:dramaList,
				});
			})
			.done();
	}

	render(){
		if(!this.state.loaded){
			return this._renderLoadingView();
		}
		return(
			<ListView 
				dataSource = {this.state.movies}
				renderRow = {this._renderMovieView.bind(this)}
				style = {styles.listview}
				initialListSize = {10}
				pageSize = {10}
				onEndReachedThreshold = {5}
				onEndReached = {this._onEndReached.bind(this)}
				enableEmptySections = {true}
				contentContainerStyle = {styles.grid}
				refreshControl = {
		          <RefreshControl
		          	refreshing = {this.state.isRefreshing}
		          	onRefresh = {this._onRefresh.bind(this)}
		            colors = {['#f74c31', '#f74c31', '#f74c31','#f74c31']}
		            progressBackgroundColor = '#ffffff'
		          />
		        }
			/>
			);
	}

	_onRefresh(){
		this.setState({
			isRefreshing: true
		});
		this.fetchData(this.props.url);
	}

	//ListView滑动到底部触发
	_onEndReached(){
		var dramaList = this.state.dramaList;
		var totalPage = dramaList.totalPage;
		var currPage = dramaList.currPage;
		var nextPage = currPage+1;
		if(nextPage <= totalPage){
			this.fetchData(dramaList.pages[currPage].url);
		}
	}

	//分割线ListView 属性 renderSeparator = {this._renderSeparator}
	// _renderSeparator(sectionId,rowId){
	// 	return(
	// 		<View style={{height:2,backgroundColor:'red'}} key={sectionId+rowId}/>
	// 		);
	//}
	
	//加载中页面
	_renderLoadingView(){
	    return(
	      <View style = {{flex:1,justifyContent:'center',alignItems:'center'}}>
	        <Text>加载中，请稍后...</Text>
	      </View>
	      );
  	}

  	//ListViue item
	_renderMovieView(movie){
	    return(
	      <View style={styles.row} key={movie.url}>
	     	<TouchableOpacity onPress={()=>this._onItemPress(movie)} activeOpacity={0.8} >
	     		<View>
			        <Image source={{uri:movie.pic}} style={styles.thumbnail}>
			        	<Text style={styles.title}>{movie.title}</Text>
			        </Image>
			        <Text numberOfLines={1} style={styles.name}>{movie.name}</Text>
			        <Text numberOfLines={1} style={styles.actor}>{movie.actor}</Text>
			    </View>
	        </TouchableOpacity>
	      </View>

	      );
	  }

	  //item 点击跳转
	  _onItemPress(movie){
	  		//console.log('detail url = '+detailUrl);
	  		const navigator = this.props.navigator;
	  		if(navigator){
	  			navigator.push({
	  				id:'DramaDetailScene',
	  				data:movie,
	  				name:movie.name,
	  				component:DramaDetailScene
	  			});
	  		}
	  	}

}

var width = WIN_WIDTH/3;
var styles = StyleSheet.create({
  grid:{
  	justifyContent: 'flex-start',
    flexDirection: 'row',  
    flexWrap: 'wrap'
	},
  row:{
  	height:200,
    width:width,
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    paddingTop:10,
    paddingBottom:10,
    marginTop:5,
    marginBottom:5,
  },
  thumbnail:{
  	flex:1,
  	width:width-20,
    height:140,
    justifyContent:'flex-end',
    resizeMode: Image.resizeMode.strech,
  },
  title:{
    fontSize:10,
    textAlign:'center',
    color:'white',
    backgroundColor:'#27272790',
  },
  name:{
	fontSize:12,
	width:width-20,
	color:'black',
	marginTop:8,
	marginBottom:5,
	textAlign:'center',
  },
  actor:{
  	fontSize:10,
  	color:'#707070',
  	width:width-20,
  	textAlign:'center',
  },
  listview:{
    backgroundColor:'#f5fcff',
  },
});