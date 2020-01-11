module.exports.auth = function (){
    console.log('doing auth');
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
            console.log('oauth_token :' + oauth_token);
            console.log('oauth_token_secret :' + oauth_token_secret);
            console.log('requestoken results :' + JSON.stringify(results));
            console.log("Requesting access token");

            console.log('https://twitter.com/oauth/authenticate?oauth_token=' + oauth_token + "\n");
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
    
                    /*oauth.getProtectedResource("https://api.twitter.com/1/statuses/home_timeline.json", "GET", oauth_access_token, oauth_access_token_secret, function (error, data, response) {
                        console.log(data);
                    });*/
                    
                    stdin.destroySoon();
                });
            });
        }
    })
}
