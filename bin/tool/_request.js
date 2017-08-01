const {URL} = require('url');
const http = require('http');
const qs = require('querystring');
let {tool} = Think;

let defaultOption = {
    host: '127.0.0.1',
    url: '/',
    method: 'get',
    data: {},
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}

function request({
    url = defaultOption.url,
    host = defaultOption.host,
    port = defaultOption.port, 
    method = defaultOption.method, 
    data = defaultOption.data, 
    headers = defaultOption.headers,
    callback, fail
}) {
    let requestData = getRequestData({url, host, port, method, data, headers});
    requestData.path = requestData.url;
    let $data = requestData.data;
    delete requestData.url;
    delete requestData.data;
    let chunks = [];
    let chunkSize = 0;
    var req = http.request(requestData, function (res) {
        res.on('data', function (chunk) {
            chunks.push(chunk);
            chunkSize += chunk.length;
        });

        res.on('end', function() {
            var data = null;  
            switch(chunks.length) {  
                case 0:     data = new Buffer(0);           break;  
                case 1:     data = chunks[0];               break;  
                default:    data = Buffer.concat(chunks);   break;  
            }
            callback(data); 
        });
    });

    req.on('error', function (e) {
        fail(e);
    });

    req.end($data);
}

function getRequestData(option) {
    let {data, method} = option;
    switch (method) {
        case 'form':
            option.method = 'post';
            option.data = tool.stringifyForm(data);
            break;
        case 'get':
            option.url  += tool.stringifyForm(data);
            option.data = {};
            break;
    }
    return option;
}

Think.tool.request = request;

Think.tool.post = function(url, data, callback, fail) {
    let urlObj = new URL(url);
    request({
        host: urlObj.hostname,
        url: urlObj.pathname,
        port: urlObj.port,
        method: 'post',
        data, callback, fail
    });
};

Think.tool.get = function(url, data, callback, fail) {
    let urlObj = new URL(url);
    request({
        host: urlObj.hostname,
        url: urlObj.pathname,
        port: urlObj.port,
        method: 'get',
        data, callback, fail
    });
};

Think.tool.form = function(url, data, callback, fail) {
    let urlObj = new URL(url);
    request({
        host: urlObj.hostname,
        url: urlObj.pathname,
        port: urlObj.port,
        method: 'form',
        data, callback, fail
    });
};