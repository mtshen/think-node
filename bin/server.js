// load node modules
const fs = require('fs');
const http = require('http');
const https = require('https');
const cluster = require('cluster');
global.__ISMASTER = cluster.isMaster;

// load variable Think
global.Think = require('./think');

// load config
require('./option');

// load log
const log = require('./log/log');

// load language
global.ThinkInfo = require('./language/lang');

// load plug-ins
const plug = require('./tool/tool');

// load route
const route = require('./route/route');

// Create service
let {option} = Think;

function createServerCallback(request, response) {
    let requestData = '';
    request.on('data', (chunk) => { requestData += chunk; });
    request.on('end', () => route(request, response, requestData));
}

function createServer() {
    http.createServer(createServerCallback).listen(option.port, option.ip || undefined);

    // https
    let $https = option.https;
    if ($https.switch && $https.key && $https.cert) {
        https.createServer({
            key: fs.readFileSync($https.key, 'utf8'),
            cert: fs.readFileSync($https.cert, 'utf8')
        }, createServerCallback).listen($https.port, option.ip || undefined);        
    }
    
    return true;
}

function run() {
    console.log('\n     _________\n    |S T A R T|\n    |thinkNode|\n     *********'.start);
    console.log(`\nhttp://${option.ip === '0.0.0.0' ? '127.0.0.1' : option.ip}:${option.port || '80'}/`.start);
    Think.onload();
}

if (option.super)
if (cluster.isMaster) {
    for (
        let i = require('os').cpus().length - 1;
        i >= 0; 
        i --
    ) cluster.fork();
    run();
}
else createServer()
else createServer() && run();
// complete!