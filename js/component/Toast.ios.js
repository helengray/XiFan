import React,{Component} from 'react';
import {
    AlertIOS,
} from 'react-native';

/*
export default class Toast extends Component{

    render(){

    }
}*/

var Toast = {
    show:function (message) :void{
        AlertIOS.alert("提示",message,[{text:"确定"}]);
    }
}

export default Toast;