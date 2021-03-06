const Configstore = require('configstore');
const packageJson = require('./package.json');
const conf = new Configstore(packageJson.name);

module.exports = {
    getCredentials :() =>{
        consumerKey = "PifhPHSIB4yUXGuBe5oWLKrjg";
        consumerSecret = "H80Txqsu0fu9uelcBssATuvFOHh9vXFN4Gz8FkrueUsEDnGoBb";
        var OAuth = require('oauth');
        var oauth = new OAuth.OAuth(
            'https://api.twitter.com/oauth/request_token',
            'https://api.twitter.com/oauth/access_token',
            consumerKey,
            consumerSecret,
            '1.0A',
            'oob',
            'HMAC-SHA1'
        );
        oauth.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
            if(error) console.log(error);
            else{
                //console.log('oauth_token :' + oauth_token);
                //console.log('oauth_token_secret :' + oauth_token_secret);
                //console.log('requestoken results :' + JSON.stringify(results));
                //console.log("Requesting access token");
                console.log('Open the following URL and enter the Pin to authorise:')
                console.log('https://twitter.com/oauth/authenticate?oauth_token=' + oauth_token);
                                
                var stdin = process.openStdin();
                console.log('PIN: ');
                stdin.on('data', function(d) {
                    d = (d+'').trim();
                    if(!d) {
                        console.warn('\nTry again: ');
                    }
                    console.log('Received PIN: ' + d);
                    oauth.getOAuthAccessToken(oauth_token, oauth_token_secret, d, function(err, oauth_access_token, oauth_access_token_secret, results2) {
                        if(err) throw err;

                        console.log(results2);
                        
                        
                        oauth.accessToken = oauth_access_token;
                        oauth.accessTokenSecret = oauth_access_token_secret;
                        console.log('Authorisation complete. Restart app to use.')
                        
                        stdin.destroy();

                        conf.set('done',true);
                        conf.set('token.at',oauth_access_token);
                        conf.set('token.ats',oauth_access_token_secret);
                    });
                });
            }
        })
    }
}