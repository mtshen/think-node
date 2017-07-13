// 启动前先进行cache, 如果是debugger除外
const glob = require("glob");
const fs = require("fs");
const path = require("path");

const CACHE_FILES = {};
const userPath = (Think.option || {}).path;
const staticResource = (Think.option || {}).staticResource || ['**/*.*'];
const _debugger = Think.debugger;

// 载入用户缓存
!_debugger && (__ISMASTER && console.log(ThinkInfo('loadCache')),
    staticResource.forEach((globPath) => {
        glob(path.join(userPath, globPath),  (err, files) => {
            !err && files.forEach((fileName) => {
                fs.readFile(fileName, (err, fileData) => {
                    !err && (CACHE_FILES[fileName] = new Buffer(fileData));
                });
            });
        })
    })
);

// 获取缓存内容
Think.getCache = (url, callback) => {
    url = path.join(url);
    let urlData = CACHE_FILES[url];
    if (urlData !== undefined) {
        callback(null, urlData);
    } else {
        fs.readFile(url, callback);
    }
};