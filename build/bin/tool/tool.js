"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// node模块
const path = require("path");
const fs = require("fs");
const cluster = require("cluster");
const think_1 = require("./../think");
// 装载内置函数
const contentType_1 = require("./contentType");
const copy_1 = require("./copy");
const createfiles_1 = require("./createfiles");
const form_1 = require("./form");
const stak_1 = require("./stak");
const random_1 = require("./random");
const __ISMASTER = cluster.isMaster;
__ISMASTER && console.log(think_1.default.info('loadTool'));
think_1.default.tool = {
    contentType: contentType_1.contentType, hasUtf8: contentType_1.hasUtf8, copy: copy_1.copy, is: copy_1.is,
    createFileSync: createfiles_1.createFileSync, createFilesSync: createfiles_1.createFilesSync,
    createFile: createfiles_1.createFile, createFiles: createfiles_1.createFiles, Stak: stak_1.Stak,
    stringifyForm: form_1.stringifyForm.bind(think_1.default.tool),
    paramForm: form_1.paramForm.bind(think_1.default.tool),
    TestModel: random_1.TestModel,
};
const THINK_TOOL_URL = think_1.default.option.tool;
// 装载第三方函数, 同步装载
if (THINK_TOOL_URL) {
    let stat = fs.readdirSync(THINK_TOOL_URL);
    stat.forEach((file) => {
        // 得到文件
        let fileName = path.join(THINK_TOOL_URL, file);
        let stats = fs.statSync(fileName);
        if (stats.isFile() && /^[.-_$\w]+\.js$/.test(fileName)) {
            try {
                let toolCallback = require(fileName.slice(0, -3));
                think_1.default.tool[getFileName(fileName)] = toolCallback;
                __ISMASTER && console.log('   ' + fileName.file);
            }
            catch (error) {
                __ISMASTER && (think_1.default.log(fileName, error), console.log('   ' + fileName.error));
            }
        }
    });
    /**
     * 将文件名转换为一个变量名
     * 将.-去除, 并使首字母大写,
     * 如 a.min.js 转换为 aMin
     * a-min.js 也转换为 aMin
     * @param fileName 文件名称
     */
    function getFileName(fileName) {
        fileName = fileName.slice(0, -3);
        let fileSlice = fileName.split(/\.|-/);
        let startText = fileSlice.shift();
        fileSlice = fileSlice.map((text) => {
            return text[0].toUpperCase() + text.slice(1);
        });
        return startText + fileSlice.join('');
    }
}
