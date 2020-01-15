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

var max = 0;

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
    var c=0,min = 0,usrname;
    var ar = ['user','home','mentions'],i=1;
    getTweets(ar[i]);
    
    keypress(process.stdin);

    // listen for the "keypress" event
    process.stdin.on('keypress', function (ch, key) {
        if (key && key.ctrl && key.name == 'c') {
            process.stdin.pause();
        }
        //console.log(key);
        if(key&&key.name == 's'&&c+3<=max){
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
        if(key&&key.name == 's'&&c+3>max){
            clear();
            c++;
            fs.readFile('tweets.txt',function(err, data){
                var t = JSON.parse(data);
                min += max - 25;
                if(i==0){
                    getTweets(a[i],t[min-1].id,null,usrname);
                }
                else{
                    getTweets(a[i],t[min-1].id);
                }
            })
        }
        if(key&&key.name == 'w'&&c>min){
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
        if(key&&key.name == 'w'&&c<=min){
            clear();
            if(min){
                c--;
                fs.readFile('tweets.txt',function(err, data){
                    var t = JSON.parse(data);
                    if(i==0){
                        getTweets(ar[i],null,t[25].id,usrname);
                    }
                    else{
                        getTweets(ar[i],null,t[25].id);
                    }
                    if(min>=25)min -= 25;
                    else min = 0;
                })
            }
            else{
                console.log('Refreshing Page');
                getTweets(ar[i]);
            }
        }
        if(key&&key.name == 'a'){
            if(i==0){
                console.log('Refreshing User Page');
            }
            if(i==1){
                i--; 
                fs.readFile('tweets.txt',function(err, data){
                    var t = JSON.parse(data);
                    //console.log(t[c-min])
                    usrname = user.screen_name;
                    getTweets(ar[i],null,null,t[c-min].user.screen_name);
                })
            }
            else{
                i--;
                getTweets(ar[i]);
            }
            c=0;
            min=0;
        }
        if(key&&key.name == 'd'){
            if(i==2){
                console.log('Refreshing Mentions Page');
            }
            else{
                i++;
            }
            getTweets(ar[i]);
            c=0;
            min=0;
        }
        if(key&&key.name == 'l'){
            fs.readFile('tweets.txt',function(err, data){
                var t = JSON.parse(data);
                console.log(t[c-min].id_str)
                if(!t[c-min].favorited){
                    T.post('favorites/create',{
                        id:t[c-min].id_str
                    }).then((er,data,response)=>{
                        console.log(er||response.data);
                        getTweets(ar[i]);
                        c = 0;
                        min = 0;
                    })
                }
                else{
                    T.post('favorites/destroy',{
                        id:t[c-min].id_str
                    }).then((er,data,response)=>{
                        console.log(er||response.data);
                        getTweets(ar[i]);
                        c = 0;
                        min = 0;
                    })
                }
            })
        }
        if (key &&  key.name == 'q') {
            process.stdin.pause();
        }
    });
}

function getTweets(type,maxid,sinceid,userid){
    var options = new Object;
    if(userid){
        options.screen_name = userid;
    }
    if(maxid){
        options.max_id = maxid;
    }
    if(sinceid){
        options.since_id = sinceid;
    }
    options.count = 50;
    options.tweet_mode = 'extended';
    T.get('statuses/'+type+'_timeline', options)
    .then((r)=>{
        fs.writeFileSync('tweets.txt', JSON.stringify(r.data));
        
        if(sinceid||maxid) max += r.data.length-25;
        else max = r.data.length;
        
        clear();
        (async()=>{
            for(var i=0;i<3&&i<r.data.length;i++){
                var x = await display.displayOneTweet(r.data[i]);
                Object.keys(x).forEach(function(key) {
                    console.log(x[key]);
                });
            }
        })()
    }).catch(console.log(options));
}
