"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 提供了4个API
const fs = require("fs");
const path = require("path");
const think_1 = require("./../think");
// 如果存在则不创建, 如果不存在则创建该文件夹
exports.createFiles = function (url, callback) {
    url = path.join(url);
    let $url = think_1.default.frontPath(url);
    fs.exists($url, function (exis) {
        !exis ?
            exports.createFiles($url, function () {
                fs.exists(url, (ex) => {
                    !ex && fs.mkdir(url, callback);
                });
            })
            :
                fs.exists(url, (ex) => {
                    !ex && fs.mkdir(url, callback);
                });
    });
};
exports.createFile = function (url, callback) {
    url = path.join(url);
    let $url = think_1.default.frontPath(url);
    exports.createFiles($url, () => {
        fs.exists(url, (ex) => {
            !ex && fs.writeFile(url, '', callback);
        });
    });
};
exports.createFilesSync = function (url) {
    url = path.join(url);
    let $url = think_1.default.frontPath(url);
    let exis = fs.existsSync($url);
    !exis && exports.createFilesSync($url);
    let ex = fs.existsSync(url);
    !ex && fs.mkdirSync(url);
};
exports.createFileSync = function (url) {
    url = path.join(url);
    let $url = think_1.default.frontPath(url);
    this.createFilesSync($url);
    let ex = fs.existsSync(url);
    !ex && fs.writeFileSync(url, '');
};
