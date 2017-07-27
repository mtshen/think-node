// 提供了4个API
let fs = require('fs');
let path = require('path');

// 如果存在则不创建, 如果不存在则创建该文件夹
Think.tool.createFiles = function(url, callback) {
    url = path.join(url);
    let $url = Think.frontPath(url);
    let $this = this;
    fs.exists($url, function(exis) {
        !exis ? 
            $this.createFiles($url, function() {
                fs.exists(url, (ex) => {
                    !ex && fs.mkdir(url, callback);
                });
            })
        : 
            fs.exists(url, (ex) => {
                !ex && fs.mkdir(url, callback);
            });
    });
}.bind(Think.tool);

Think.tool.createFile = function(url, callback) {
    url = path.join(url);
    let $url = Think.frontPath(url);
    this.createFiles($url, () => {
        fs.exists(url, (ex) => {
            !ex && fs.writeFile(url, callback);
        });
    });
}.bind(Think.tool);

Think.tool.createFilesSync = function(url) {
    url = path.join(url);
    let $url = Think.frontPath(url);
    let $this = this;
    let exis = fs.existsSync($url);
    !exis && $this.createFilesSync($url);
    let ex = fs.existsSync(url);
    !ex && fs.mkdirSync(url);
}.bind(Think.tool);

Think.tool.createFileSync = function(url) {
    url = path.join(url);
    let $url = Think.frontPath(url);
    this.createFilesSync($url);
    let ex = fs.existsSync(url);
    !ex && fs.writeFileSync(url);
}.bind(Think.tool);
