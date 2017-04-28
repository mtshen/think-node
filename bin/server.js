global.END = Symbol('end');
global.NODATA = Symbol('nodata');

const http = require('http');
const cluster = require('cluster');
const option = require('./option');
const route = require("./route/route");

if (cluster.isMaster) {
    for (
        let i = require('os').cpus().length - 1;
        i >= 0; 
        i --
    ) cluster.fork();
} else {
    http.createServer(function(request, response) {
        let requestData = '';
        request.on('data', (chunk) => { requestData += chunk; });
        request.on('end', () => route(request, response, requestData));
    }).listen(option.port);
    console.log(`ThinkNode[127.0.0.1:${option.port}]: thread${cluster.worker.id} start!`);
}