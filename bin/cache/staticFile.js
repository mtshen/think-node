// 启动前先进行cache, 如果是debugger除外
const glob = require("glob");
const fs = require("fs");
const path = require("path");
const option = require('./../option');
const CACHE_FILES = {};
const _path = option.path;
const _debugger = option.debugger;
// 存储模式为 url: Buffer()
// options 是可选的

!_debugger && option.staticResource.forEach(function(globPath) {
    glob(path.join(_path, globPath), function (err, files) {
        !err && files.forEach((fileName) => {
            fs.readFile(fileName, (err, fileData) => {
                !err && (CACHE_FILES[path.join(fileName)] = new Buffer(fileData));
            });
        });
    })
});

function getUrl(url, callback) {
    url = path.join(url);
    let urlData = CACHE_FILES[url];
    if (urlData !== undefined) {
        callback(null, urlData);
    } else {
        fs.readFile(url, callback);
    }
};

module.exports = getUrl;