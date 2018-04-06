// think server
// load node modules
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as cluster from 'cluster';
import * as process from 'child_process';

// 载入think模块
import think from './think';

// 载入语言模块
import './language/lang';
// 载入用户配置项
import './option';
// 载入tool模块
import './tool/tool';
// 载入日志模块
import './log/log';

import route from './route/route';

// Create service
let {option} = think;

function createServerCallback(request, response) {
    let requestData = '';
    request.on('data', (chunk) => { requestData += chunk; });
    request.on('end', () => route(request, response, requestData));
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
        } else if ($https.pfx) {
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
    console.log(('\n     _________\n    |S T A R T|\n    |thinkNode|\n     *********' as any).start);
    console.log((`\nhttp://${option.ip === '0.0.0.0' ? '127.0.0.1' : option.ip}:${option.port || '80'}/` as any).start);
    think.onload();
    process.exec(`start http://localhost:${option.port}/`);
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