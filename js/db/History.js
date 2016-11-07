
import React from 'react';
var id;
var name = "";
var time = "";
var pic = "";
var url = "";
var title = "";
var indexPlay;
var indexName;
var sourceIndex;

const History = React.createClass({
    render(){
        return null;
    }
    ,
    setId(id){
        this.id = id;
    },
    getId(){
        return this.id;
    },
    setName(name){
        this.name = name;
    },
    getName(){
        return this.name;
    },
    setTime(time){
        this.time = time;
    },
    getTime(){
        return this.time;
    },
    setPic(pic){
        this.pic = pic;
    },
    getPic(){
        return this.pic;
    },
    setUrl(url){
        this.url = url;
    },
    getUrl(){
        return this.url;
    },
    setTitle(title){
        this.title = title;
    },
    getTitle(){
        return this.title;
    },
    setIndexPlay(index){
      this.indexPlay = index;
    },
    getIndexPlay(){
        return this.indexPlay;
    },
    setIndexName(name){
        this.indexName = name;
    },
    getIndexName(){
        return this.indexName;
    },
    setSourceIndex(source){
        this.sourceIndex = source;
    },
    getSourceIndex(){
        return this.sourceIndex;
    }
});
module.exports = History;

