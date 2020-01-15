#!/usr/bin/env node

const auth = require('./auth.js');
const Configstore = require('configstore');
const packageJson = require('./package.json');
const conf = new Configstore(packageJson.name);
const display = require('./display.js')
const Twit = require('twit');
const keypress = require('keypress')
const clear = require('clear');
const fs = require('fs');


var tokenDone = conf.get('done');
if(!tokenDone){
    console.log('doing auth');
    auth.getCredentials();
}
else{
    var token = conf.get('token');
    var T = new Twit({
        consumer_key: 'PifhPHSIB4yUXGuBe5oWLKrjg',
        consumer_secret: 'H80Txqsu0fu9uelcBssATuvFOHh9vXFN4Gz8FkrueUsEDnGoBb',
        access_token: token.at,
        access_token_secret: token.ats,
    });
    var c=0,min = 0,max = 50;
    getTweets();
    
    keypress(process.stdin);

    // listen for the "keypress" event
    process.stdin.on('keypress', function (ch, key) {
        if (key && key.ctrl && key.name == 'c') {
            process.stdin.pause();
        }
        //console.log(key);
        if(key&&key.name == 'down'&&c+3<=max){
            console.log('yo')
            clear();
            c++;
            fs.readFile('tweets.txt',function(err, data){
                var t = JSON.parse(data);
                (async()=>{
                    for(var i=c-min;i<c+3-min;i++){
                        var x = await display.displayOneTweet(t[i]);
                        Object.keys(x).forEach(function(key) {
                            console.log(x[key]);
                        });
                    }
                })();
            })
        }
        if(key&&key.name == 'down'&&c+3>max){
            clear();
            c++;
            fs.readFile('tweets.txt',function(err, data){
                var t = JSON.parse(data);
                getTweets(t[min+24].id);
                min += 25;
                max += 25;
            })
        }
        if(key&&key.name == 'up'&&c>min){
            console.log('yo')
            clear();
            c--;
            fs.readFile('tweets.txt',function(err, data){
                var t = JSON.parse(data);
                (async()=>{
                    for(var i=c-min;i<c+3-min;i++){
                        var x = await display.displayOneTweet(t[i]);
                        Object.keys(x).forEach(function(key) {
                            console.log(x[key]);
                        });
                    }
                })();
            })
        }

        if(key&&key.name == 'up'&&c<=min){
            clear();
            if(min){
                c--;
                fs.readFile('tweets.txt',function(err, data){
                    var t = JSON.parse(data);
                    getTweets(null,t[25].id);
                    min -= 25;
                    max -= 25;
                })
            }
            else{
                getTweets();
            }
        }
    });
}

function getTweets(maxid,sinceid){
    if(!maxid&&!sinceid){
        T.get('statuses/home_timeline',{
            count:50,
            tweet_mode:'extended'
        })
        .then((r)=>{
            fs.writeFileSync('tweets.txt',JSON.stringify(r.data));
            clear();
            (async()=>{
                for(var i=0;i<3;i++){
                    var x = await display.displayOneTweet(r.data[i]);
                    Object.keys(x).forEach(function(key) {
                        console.log(x[key]);
                    });
                }
            })()
        });
    }
    if(maxid){
        T.get('statuses/home_timeline',{
            count:50,
            tweet_mode:'extended',
            max_id: maxid
        })
        .then((r)=>{
            fs.writeFileSync('tweets.txt',JSON.stringify(r.data));
            clear();
            (async()=>{
                for(var i=0;i<3;i++){
                    var x = await display.displayOneTweet(r.data[i]);
                    Object.keys(x).forEach(function(key) {
                        console.log(x[key]);
                    });
                }
            })()
        });
    }
    if(sinceid){
        T.get('statuses/home_timeline',{
            count:50,
            tweet_mode:'extended',
            since_id: sinceid
        })
        .then((r)=>{
            fs.writeFileSync('tweets.txt',JSON.stringify(r.data));
            clear();
            (async()=>{
                for(var i=0;i<3;i++){
                    var x = await display.displayOneTweet(r.data[i]);
                    Object.keys(x).forEach(function(key) {
                        console.log(x[key]);
                    });
                }
            })()
        });
    }
}
