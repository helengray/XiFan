import React from 'react';
import SQLiteStorage from 'react-native-sqlite-storage';

SQLiteStorage.DEBUG(true);
var database_name = "xifan.db";
var database_version = "2.0";
var database_displayname = "MySQLite";
var database_size = -1;
var db;
const Collection_TABLE_NAME = "Collection";//收藏表
const History_TABLE_NAME = "History";//历史表
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
    open(){
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
    },
    createTable(){
        if (!db) {
            this.open();
        }
        //创建收藏表
        db.transaction((tx)=> {
            tx.executeSql('CREATE TABLE IF NOT EXISTS ' + Collection_TABLE_NAME + '(' +
                'id INTEGER PRIMARY KEY NOT NULL,' +
                'name VARCHAR,' +
                'actor VARCHAR,' +
                'time VARCHAR,' +
                'pic VARCHAR,' +
                'url VARCHAR,' +
                'title VARCHAR'
                + ');'
                , [], ()=> {
                    this._successCB('executeSql');
                }, (err)=> {
                    this._errorCB('executeSql', err);
                });
            tx.executeSql('CREATE TABLE IF NOT EXISTS ' + History_TABLE_NAME + '(' +
                'id INTEGER PRIMARY KEY NOT NULL,' +
                'name VARCHAR,' +
                'time VARCHAR,' +
                'pic VARCHAR,' +
                'url VARCHAR,' +
                'title VARCHAR,'+
                'indexPlay INTEGER,'+
                'indexName VARCHAR,'+
                'sourceIndex INTEGER'
                + ');'
                , [], ()=> {
                    this._successCB('executeSql');
                }, (err)=> {
                    this._errorCB('executeSql', err);
                });
        }, (err)=> {
            this._errorCB('transaction', err);
        }, ()=> {
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
                reject('db not open');
            }
        });

    },
    findCollectionByName(name){//获取收藏记录
        return new Promise((resolve, reject)=>{
            if(db){
                db.executeSql('SELECT * FROM '+Collection_TABLE_NAME +' WHERE name=? LIMIT 1',[name],
                    (results)=>{
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
    saveHistory(history){//保存观看历史记录
        return new Promise((resolve, reject)=>{
            if(db){
                this.findHistoryByName(history.getName()).then(()=>{
                    //更新
                    this.updateHistory(history).then(()=>{
                        resolve();
                    }).catch((err)=>{
                        reject(err);
                    });
                }).catch((e)=>{
                    if(e === 0){
                        db.executeSql(
                            'INSERT INTO '+History_TABLE_NAME+' (name,time,pic,url,title,indexPlay,indexName,sourceIndex) VALUES(?,?,?,?,?,?,?,?)',
                            [history.getName(),history.getTime(),history.getPic(),history.getUrl(),history.getTitle(),history.getIndexPlay(),history.getIndexName(),history.getSourceIndex()],
                            ()=>{
                                this._successCB('saveHistory');
                                resolve();
                            },
                            (err)=>{
                                this._errorCB('saveHistory',err);
                                reject(err);
                            });
                    }else {
                        reject(e);
                    }
                });

            }else {
                reject('db not open');
            }
        });

    },
    updateHistory(history){//更新观看历史记录
        return new Promise((resolve, reject)=>{
            if(db) {
                db.executeSql('UPDATE ' + History_TABLE_NAME + ' SET time=?,indexPlay=?,indexName=?,sourceIndex=? WHERE name="' + history.getName()+'"',
                    [history.getTime(), history.getIndexPlay(), history.getIndexName(), history.getSourceIndex()],
                    ()=> {
                        this._successCB('updateHistory');
                        resolve();
                    },
                    (err)=> {
                        this._errorCB('updateHistory', err);
                        reject(err);
                    });
            }else{
                reject('db not open');
            }
        });
    },
    findHistoryByName(name){//获取观看历史记录
        return new Promise((resolve, reject)=>{
            if(db){
                db.executeSql('SELECT * FROM '+History_TABLE_NAME +' WHERE name=? LIMIT 1',[name],
                    (results)=>{
                        if(results.rows.length > 0){
                            resolve(results.rows.item(0));
                        }else {
                            reject(0);
                        }

                        this._successCB('findHistoryByName')
                    },(err)=>{
                        reject(err);
                        this._errorCB('findHistoryByName',err)
                    });
            }else {
                reject('db not open');
            }
        });

    },
    deleteHistoryByName(name){//删除观看历史记录
        return new Promise((resolve, reject)=>{
            if(db){
                db.executeSql('DELETE FROM '+History_TABLE_NAME +' WHERE name=?',[name],
                    ()=>{
                        resolve();
                        this._successCB('deleteHistoryByName');
                    },(err)=>{
                        reject(err);
                        this._errorCB('deleteHistoryByName',err);
                    });
            }else {
                reject('db not open');
            }
        });

    },
    deleteHistoryByIds(ids){
        return new Promise((resolve, reject)=>{
            if(db){
                var idIn = null;
                for (var i=0;i<ids.length;i++){
                    if(i == 0){
                        idIn = ''+ids[i];
                    }else {
                        idIn = idIn+','+ids[i];
                    }
                }
                if(idIn){
                    db.executeSql('DELETE FROM '+History_TABLE_NAME +' WHERE id in ('+idIn+')',null,
                        ()=>{
                            resolve();
                            this._successCB('deleteHistoryByIds');
                        },
                        (err)=>{
                            reject(err);
                            this._errorCB('deleteHistoryByIds',err);
                        }
                    );
                }
            }else {
                reject('db not open');
            }
        });
    },
    listHistory(pageSize,index){//获取观看历史记录列表
        return new Promise((resolve, reject)=>{
            if(db){
                db.executeSql('SELECT * FROM '+History_TABLE_NAME +' LIMIT '+pageSize+' OFFSET '+((index-1)*pageSize),[],
                    (results)=>{
                        var len = results.rows.length;
                        var datas = [];
                        for(let i=0;i<len;i++){
                            datas.push(results.rows.item(i));
                        }
                        resolve(datas);
                        this._successCB('listHistory');
                    },(err)=>{
                        reject(err);
                        this._errorCB('listHistory',err);
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

