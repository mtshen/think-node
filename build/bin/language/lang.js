"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 这里是与国际化相关代码,
 * 根据用户设置的语言类型, 这里会加载相应的JSON
 * 打印信息使用think.info('xxx');
 * 如此可以方便的达到国际化效果
 */
const path = require("path");
const fs = require("fs");
const cluster = require("cluster");
const think_1 = require("./../think");
const __ISMASTER = cluster.isMaster;
const THINK_LENG_PATH = path.join(__dirname, think_1.default.language + '.json');
let lengInfo;
if (!fs.existsSync(THINK_LENG_PATH)) {
    __ISMASTER && console.log('The loading language failed. The language file did not exist!'.warning);
    __ISMASTER && console.log(THINK_LENG_PATH.error);
    // 如果没有设置lengPaht或没有找到语言文件, 自动加载zh.json
    lengInfo = require(path.join(__dirname, 'zh.json'));
    __ISMASTER && console.log(lengInfo['loadLengN'].error);
}
else {
    // 如果找到了语言文件, 自动加载
    lengInfo = require(THINK_LENG_PATH);
    __ISMASTER && console.log(lengInfo['loadLeng']);
    __ISMASTER && console.log('   ' + THINK_LENG_PATH.file);
    __ISMASTER && console.log(lengInfo['loadLengY']);
}
function info(i) {
    let text = lengInfo[i];
    return text || '';
}
;
think_1.default.info = info;
exports.default = info;
