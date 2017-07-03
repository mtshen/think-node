const path = require('path');
const fs = require('fs');
__ISMASTER && console.log('load option'.green);

// 默认option
Think.option = require(path.join(__dirname, 'defaultOption.json'));

// 引入配置文件
require(path.join(Think.DIR, 'option.js'));
