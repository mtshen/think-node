import * as path from 'path';
import * as fs from 'fs';
import think from './think';

// 默认option
think.option = require(path.join(__dirname, 'defaultOption.json'));

// 引入配置文件
require(path.join(think.DIR, 'option.js'));
