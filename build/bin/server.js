"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// think server
// load node modules
const fs = require("fs");
const http = require("http");
const https = require("https");
const cluster = require("cluster");
const process = require("child_process");
// 载入think模块
const think_1 = require("./think");
// 载入语言模块
require("./language/lang");
// 载入用户配置项
require("./option");
// 载入tool模块
require("./tool/tool");
// 载入日志模块
require("./log/log");
// 载入jarvis
require("./socket/main");
// 载入路由
const route_1 = require("./route/route");
// Create service
let { option } = think_1.default;
function createServerCallback(request, response) {
    let requestData = '';
    request.on('data', (chunk) => { requestData += chunk; });
    request.on('end', () => route_1.default(request, response, requestData));
}
function createServer() {
    http.createServer(createServerCallback).listen(option.port, option.ip || undefined);
    // https
    let $https = option.https;
    if ($https.switch) {
        let httpsOption;
        if ($https.key && $https.cert) {
            httpsOption = {
                key: fs.readFileSync($https.key, 'utf8'),
                cert: fs.readFileSync($https.cert, 'utf8')
            };
        }
        else if ($https.pfx) {
            httpsOption = {
                pfx: fs.readFileSync($https.pfx, 'utf8'),
                passphrase: $https.pass
            };
        }
        // 创建https服务
        httpsOption &&
            https.createServer(httpsOption, createServerCallback)
                .listen($https.port, option.ip || undefined);
    }
    return true;
}
function run() {
    console.log('\n     _________\n    |S T A R T|\n    |thinkNode|\n     *********'.start);
    console.log(`\nhttp://${option.ip === '0.0.0.0' ? '127.0.0.1' : option.ip}:${option.port || '80'}/`.start);
    think_1.default.onload();
    process.exec(`start http://localhost:${option.port}/`);
}
if (option.super)
    if (cluster.isMaster) {
        for (let i = require('os').cpus().length - 1; i >= 0; i--)
            cluster.fork();
        run();
    }
    else
        createServer();
else
    createServer() && run();
// complete!
