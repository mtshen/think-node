// 提供了4个API
import * as fs from 'fs';
import * as path from 'path';
import think from './../think';
// 如果存在则不创建, 如果不存在则创建该文件夹
export let createFiles = function(url: string, callback: any) {
    url = path.join(url);
    let $url: string = think.frontPath(url);
    fs.exists($url, function(exis: boolean) {
        !exis ? 
            createFiles($url, function() {
                fs.exists(url, (ex) => {
                    !ex && fs.mkdir(url, callback);
                });
            })
        : 
            fs.exists(url, (ex) => {
                !ex && fs.mkdir(url, callback);
            });
    });
}

export let createFile = function(url: string, callback) {
    url = path.join(url);
    let $url: string = think.frontPath(url);
    createFiles($url, () => {
        fs.exists(url, (ex) => {
            !ex && fs.writeFile(url, '', callback);
        });
    });
}

export let createFilesSync = function(url) {
    url = path.join(url);
    let $url: string = think.frontPath(url);
    let exis: boolean = fs.existsSync($url);
    !exis && createFilesSync($url);
    let ex: boolean = fs.existsSync(url);
    !ex && fs.mkdirSync(url);
}

export let createFileSync = function(url) {
    url = path.join(url);
    let $url: string = think.frontPath(url);
    this.createFilesSync($url);
    let ex: boolean = fs.existsSync(url);
    !ex && fs.writeFileSync(url, '');
}
