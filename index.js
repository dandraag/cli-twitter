#!/usr/bin/env node

const auth = require('./auth.js');
const Configstore = require('configstore');
const packageJson = require('./package.json');
const conf = new Configstore(packageJson.name);

console.log('doing auth');
var tokenDone = conf.get('done');
if(!tokenDone){
    auth.getCredentials();
}
else{
    var token = conf.get('token');
    console.log(token);
}