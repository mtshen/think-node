const path = require('path');
const fs = require('fs');
const stat = fs.stat;

let copy = function (src, dst) {
    //读取目录
    fs.readdir(src, function (err, paths) {
        if (err) return console.log(err);
        paths.forEach(function (path) {
            let _src = path.join(src, path);
            let _dst = path.join(dst, path);
            let readable, writable;
            stat(_src, function (err, st) {
                if (err) throw err;
                if (st.isFile()) {
                    readable = fs.createReadStream(_src);//创建读取流
                    writable = fs.createWriteStream(_dst);//创建写入流
                    readable.pipe(writable);
                } else if (st.isDirectory()) {
                    exists(_src, _dst, copy);
                }
            });
        });
    });
}

let exists = function (src, dst, callback) {
    
    //测试某个路径下文件是否存在
    fs.exists(dst, function (exists) {
        if (exists) {
            callback(src, dst);
        } else {
            fs.mkdir(dst, function () {//创建目录
                callback(src, dst)
            })
        }
    })
}

exists.copy = copy;

module.exports = exists;