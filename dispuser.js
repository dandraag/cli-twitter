const Configstore = require('configstore');
const packageJson = require('./package.json');
const conf = new Configstore(packageJson.name);
const Twit = require('twit');
var token = conf.get('token');
var T = new Twit({
    consumer_key: 'PifhPHSIB4yUXGuBe5oWLKrjg',
    consumer_secret: 'H80Txqsu0fu9uelcBssATuvFOHh9vXFN4Gz8FkrueUsEDnGoBb',
    access_token: token.at,
    access_token_secret: token.ats,
});
const itoa = require('image-to-ascii');
const figlet = require('figlet')

module.exports = {
    getUserDetails:(_callback)=>{
        var x;
        T.get('account/verify_credentials', { skip_status: true })
        .catch(function (err) {
            console.log('caught error', err.stack)
        })
        .then((result) => {
            user = result.data;
            //console.log(user);
            
            itoa(user.profile_image_url,{
                size:{
                    height:'20%'
                }
            },(err, converted) => {
                console.log(user.name,' (@', user.screen_name,')');
                console.log(err || converted);
                for(var i=0;i<process.stdout.columns; i++){
                   process.stdout.write("/");
                }
                _callback();
            });
        })
        
    }
}