const http = require('http');
const option = require('./option');   // 配置
const route = require("./route/route");   // 请求处理器

// 创建服务
http.createServer(function(request, response) {
    let requestData = '';
    request.on('data', function(chunk) {
        requestData += chunk;
    });
    request.on('end', function () {
        route(request, response, requestData);
    });
}).listen(option.port);