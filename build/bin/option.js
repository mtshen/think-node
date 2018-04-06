"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const think_1 = require("./think");
// 默认option
think_1.default.option = require(path.join(__dirname, 'defaultOption.json'));
// 引入配置文件
require(path.join(think_1.default.DIR, 'option.js'));
