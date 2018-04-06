"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 启动前先进行cache, 如果是debugger除外
const fs = require("fs");
const path = require("path");
const glob_1 = require("glob");
const think_1 = require("./../think");
const cluster = require("cluster");
const CACHE_FILES = {};
const __ISMASTER = cluster.isMaster;
// 需要的option
const THINK_OPTION = think_1.default.option;
const THINK_OPTION_USER_PATH = THINK_OPTION.path;
const THINK_OPTION_STATIC = THINK_OPTION.staticResource || ['**/*.*'];
const THINK_OPTION_DEBUGGER = THINK_OPTION.debugger;
// 载入用户缓存
if (!THINK_OPTION_DEBUGGER) {
    __ISMASTER && console.log(think_1.default.info('loadCache'));
    // 取到需要缓存的内容
    THINK_OPTION_STATIC.forEach((globPath) => {
        glob_1.default(path.join(THINK_OPTION_USER_PATH, globPath), (err, files) => {
            // 载入文件
            !err && files.forEach((fileName) => {
                fs.readFile(fileName, (err, fileData) => {
                    // 加入缓存: Buffer使用的是内存, 即使大量数据也不会导致node崩溃
                    !err && (CACHE_FILES[fileName] = new Buffer(fileData));
                });
            });
        });
    });
}
;
// 获取缓存内容
think_1.default.getCache = (url, callback) => {
    url = path.join(url);
    let urlData = CACHE_FILES[url];
    if (urlData !== undefined) {
        callback(null, urlData);
    }
    else {
        fs.readFile(url, callback);
    }
};
