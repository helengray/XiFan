
import React from 'react';
var id;
var name = "";
var actor = "";
var time = "";
var pic = "";
var url = "";
var title = "";

const Movie = React.createClass({
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
    setActor(actor){
        this.actor = actor;
    },
    getActor(){
        return this.actor;
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
    }
});
module.exports = Movie;

