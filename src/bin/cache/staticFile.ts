// 启动前先进行cache, 如果是debugger除外
import * as fs from 'fs';
import * as path from 'path';
import glob from 'glob';
import think from './../think';
import * as cluster from 'cluster';

const CACHE_FILES = {};
const __ISMASTER: boolean = cluster.isMaster;

// 需要的option
const THINK_OPTION = think.option;
const THINK_OPTION_USER_PATH: string = THINK_OPTION.path;
const THINK_OPTION_STATIC: string[] = THINK_OPTION.staticResource || ['**/*.*'];
const THINK_OPTION_DEBUGGER: boolean = THINK_OPTION.debugger;

// 载入用户缓存
if (!THINK_OPTION_DEBUGGER) {
    __ISMASTER && console.log(think.info('loadCache'));

    // 取到需要缓存的内容
    THINK_OPTION_STATIC.forEach((globPath: string) => {
        glob(path.join(THINK_OPTION_USER_PATH, globPath), (err, files) => {

            // 载入文件
            !err && files.forEach((fileName: string) => {
                fs.readFile(fileName, (err, fileData) => {
                    // 加入缓存: Buffer使用的是内存, 即使大量数据也不会导致node崩溃
                    !err && (CACHE_FILES[fileName] = new Buffer(fileData));
                });
            });
        })
    });
};

// 获取缓存内容
think.getCache = (url: string, callback) => {
    url = path.join(url);
    let urlData = CACHE_FILES[url];
    if (urlData !== undefined) {
        callback(null, urlData);
    } else {
        fs.readFile(url, callback);
    }
};