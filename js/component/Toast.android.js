import React,{Component} from 'react';
import {
    ToastAndroid,
} from 'react-native';


var Toast = {
    show:function (message) :void{
        ToastAndroid.show(message,ToastAndroid.SHORT);
    }
}

export default Toast;