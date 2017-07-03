// load node modules
const http = require('http');
const cluster = require('cluster');
global.__ISMASTER = cluster.isMaster;

// load variable Think
global.Think = require('./think');

// load config
require('./option');

// load language
global.ThinkInfo = require('./language/lang');

// load plug-ins
const plug = require('./tool/tool');

// load route
const route = require('./route/route');

// Create service
let {option} = Think;

/* 测试终止
if (cluster.isMaster) {
    for (
        let i = require('os').cpus().length - 1;
        i >= 0; 
        i --
    ) cluster.fork();

    console.log('\n\n     _________\n    |S T A R T|\n    |ThinkNode|\n     *********'.debug);
    console.log(`ip: ${option.ip || ''}\nport: ${option.port || ''}`.debug);
} else {
    http.createServer((request, response) => {
        let requestData = '';
        request.on('data', (chunk) => { requestData += chunk; });
        request.on('end', () => route(request, response, requestData));
    }).listen(option.port, option.ip || undefined);
}
*/

http.createServer((request, response) => {
    let requestData = '';
    request.on('data', (chunk) => { requestData += chunk; });
    request.on('end', () => route(request, response, requestData));
}).listen(option.port, option.ip || undefined);
console.log('\n\n     _________\n    |S T A R T|\n    |ThinkNode|\n     *********'.debug);
console.log(`ip: ${option.ip || ''}\nport: ${option.port || ''}`.debug);

// complete!