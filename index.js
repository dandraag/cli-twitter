#!/usr/bin/env node

const auth = require('./auth.js');
const Configstore = require('configstore');
const packageJson = require('./package.json');
const conf = new Configstore(packageJson.name);
const display = require('./display.js')


var tokenDone = conf.get('done');
if(!tokenDone){
    console.log('doing auth');
    auth.getCredentials();
}
else{
    var token = conf.get('token');
    //console.log(token);
    display.display3();
}