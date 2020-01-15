const Configstore = require('configstore');
const packageJson = require('./package.json');
const conf = new Configstore(packageJson.name);
const Twit = require('twit');
var token = conf.get('token');
const chalk = require('chalk');
var T = new Twit({
    consumer_key: 'PifhPHSIB4yUXGuBe5oWLKrjg',
    consumer_secret: 'H80Txqsu0fu9uelcBssATuvFOHh9vXFN4Gz8FkrueUsEDnGoBb',
    access_token: token.at,
    access_token_secret: token.ats,
});
const itoa = require('image-to-ascii');


function display(data){
    return new Promise(resolve => {
        itoa(data.user.profile_image_url,{
            size:{
                height:'20%'
            }
        },(err, converted) => {
            var x = {
                title:chalk.cyan(data.user.name,' (@', data.user.screen_name,')'),
                img:converted,
                tweet: chalk.yellow(data.full_text),
                like: data.favorited?chalk.red('L: '+data.favorite_count):'L:'+data.favorite_count,
                rt: data.retweeted?chalk.red('R: '+data.retweet_count):'R: '+data.retweet_count
            };
            resolve(x);
        });
    })
    
}
module.exports={
    displayOneTweet:(data)=>{
        return new Promise(resolve => {
            itoa(data.user.profile_image_url,{
                size:{
                    height:'20%'
                }
            },(err, converted) => {
                var x = {
                    title:chalk.cyan(data.user.name,' (@', data.user.screen_name,')'),
                    img:converted,
                    tweet: chalk.yellow(data.full_text),
                    like: data.favorited?chalk.red('L: '+data.favorite_count):'L:'+data.favorite_count,
                    rt: data.retweeted?chalk.red('R: '+data.retweet_count):'R: '+data.retweet_count
                };
                resolve(x);
            });
        })
    }
}