const path = require('path');
const fs = require('fs');

// 默认option
Think.option = require(path.join(__dirname, 'defaultOption.json'));

// 引入配置文件
require(path.join(Think.DIR, 'option.js'));
