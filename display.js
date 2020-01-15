const Configstore = require('configstore');
const packageJson = require('./package.json');
const conf = new Configstore(packageJson.name);
const Twit = require('twit');
const clear = require('clear');
var token = conf.get('token');
const displayUser = require('./dispuser.js');
const chalk = require('chalk');
const async = require('async');
var T = new Twit({
    consumer_key: 'PifhPHSIB4yUXGuBe5oWLKrjg',
    consumer_secret: 'H80Txqsu0fu9uelcBssATuvFOHh9vXFN4Gz8FkrueUsEDnGoBb',
    access_token: token.at,
    access_token_secret: token.ats,
});
const itoa = require('image-to-ascii');


function display(data, _callback){
    return new Promise(resolve => {
        itoa(data.user.profile_image_url,{
            size:{
                height:'20%'
            }
        },(err, converted) => {
            
            //console.log(x);
            
            var x = {
                title:chalk.cyan(data.user.name,' (@', data.user.screen_name,')'),
                img:converted,
                tweet: chalk.yellow(data.full_text),
                like: data.favorited?chalk.red('L: '+data.favorite_count):'L:'+data.favorite_count,
                rt: data.retweeted?chalk.red('R: '+data.retweet_count):'R: '+data.retweet_count
            };
            //console.log(x)
            resolve(x)
                
            
            //console.log(x);
        });
    })
    
}
module.exports={
    display3:()=>{
        clear();
        displayUser.getUserDetails(function(){
            T.get('statuses/home_timeline',{
                count:3,
                tweet_mode:'extended'
            })
            .then(async (r)=>{
                //console.log(r.data);
                //display(r.data[2],2,display(r.data[1],1,display(r.data[0],0)));
                for(var i=0;i<3;i++){
                    var x = await display(r.data[i]);
                    Object.keys(x).forEach(function(key) {
                        console.log(x[key]);
                    });
                }
                            
            })
        });       
    }
}