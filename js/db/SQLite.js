import React from 'react';
import SQLiteStorage from 'react-native-sqlite-storage';

SQLiteStorage.DEBUG(true);
var database_name = "xifan.db";
var database_version = "1.0";
var database_displayname = "MySQLite";
var database_size = 200000;
var db;
const Collection_TABLE_NAME = "Collection";//收藏表

const SQLite = React.createClass({

    render(){
        return null;
    },
    componentWillUnmount(){
        if(db){
            this._successCB('close');
            db.close();
        }else {
            console.log("SQLiteStorage not open");
        }
    },
    createTable(){
        db = SQLiteStorage.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
            ()=>{
                this._successCB('open');
            },
            (err)=>{
                this._errorCB('open',err);
            });
        //创建收藏表
        db.transaction((tx)=>{
            tx.executeSql('CREATE TABLE IF NOT EXISTS '+Collection_TABLE_NAME+'('+
            'id INTEGER PRIMARY KEY NOT NULL,'+
            'name VARCHAR,'+
            'actor VARCHAR,'+
            'time VARCHAR,'+
            'pic VARCHAR,'+
            'url VARCHAR,'+
            'title VARCHAR'
            +');'
            ,[],()=>{
                    this._successCB('executeSql');
                },(err)=>{
                    this._errorCB('executeSql',err);
                });
        },(err)=>{
            this._errorCB('transaction',err);
        },()=>{
            this._successCB('transaction');
        })
    },
    saveCollection(movie){//保存收藏记录
        return new Promise((resolve, reject)=>{
            if(db){
                db.executeSql(
                    'INSERT INTO '+Collection_TABLE_NAME+' (name,actor,time,pic,url,title) VALUES(?,?,?,?,?,?)',
                    [movie.getName(),movie.getActor(),movie.getTime(),movie.getPic(),movie.getUrl(),movie.getTitle()],
                    ()=>{
                        this._successCB('saveCollection');
                        resolve();
                    },
                    (err)=>{
                        this._errorCB('saveCollection',err);
                        reject();
                    })
            }else {
                reject();
            }
        });

    },
    findCollectionByName(name){//获取收藏记录
        return new Promise((resolve, reject)=>{
            if(db){
                db.executeSql('SELECT * FROM '+Collection_TABLE_NAME +' WHERE name=? LIMIT 1',[name],
                    (results)=>{
                        console.log(results);
                        if(results.rows.length > 0){
                            resolve(results.rows.item(0));
                        }else {
                            reject('not find item');
                        }

                        this._successCB('findCollectionByName')
                    },(err)=>{
                        reject(err);
                        this._errorCB('findCollectionByName',err)
                    });
            }else {
                reject('db not open');
            }
        });

    },
    deleteCollectionByName(name){//删除收藏记录
        return new Promise((resolve, reject)=>{
            if(db){
                db.executeSql('DELETE FROM '+Collection_TABLE_NAME +' WHERE name=?',[name],
                    ()=>{
                        resolve();
                        this._successCB('deleteCollectionByName');
                    },(err)=>{
                        reject(err);
                        this._errorCB('deleteCollectionByName',err);
                    });
            }else {
                reject('db not open');
            }
        });

    },
    listCollection(pageSize,index){//获取收藏记录列表
        return new Promise((resolve, reject)=>{
            if(db){
                db.executeSql('SELECT * FROM '+Collection_TABLE_NAME +' LIMIT '+pageSize+' OFFSET '+((index-1)*pageSize),[],
                    (results)=>{
                        var len = results.rows.length;
                        var datas = [];
                        for(let i=0;i<len;i++){
                            datas.push(results.rows.item(i));
                        }
                        resolve(datas);
                        this._successCB('listCollection');
                    },(err)=>{
                        reject(err);
                        this._errorCB('listCollection',err);
                    });
            }else {
                reject('db not open');
            }
        });
    },
    close(){
        if(db){
            this._successCB('close');
            db.close();
        }else {
            console.log("SQLiteStorage not open");
        }
        db = null;
    },
    _successCB(name){
        console.log("SQLiteStorage "+name+" success");
    },
    _errorCB(name, err){
        console.log("SQLiteStorage "+name+" error:"+err);
    }
});

module.exports = SQLite;

