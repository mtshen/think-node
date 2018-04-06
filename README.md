[![npm version](https://img.shields.io/npm/v/think-node.svg?style=flat)](https://www.npmjs.com/package/think-node)
[![npm downloads](https://img.shields.io/npm/dt/think-node.svg)](https://www.npmjs.com/package/think-node)
[![npm language](https://img.shields.io/badge/language-nodeJS-red.svg)](https://www.npmjs.com/package/think-node)

	thinkNode是一个免费开源的，快速、简单的面向对象的轻量级Node开发框架
 
 #### 如何入门? 
 请点击这里 [think-node入门](https://github.com/mtshen/thinkNode/blob/master/docs/%E5%85%A5%E9%97%A8.md)
 
 #### 关于新版本
 [think-node 1.1.2 说明](https://github.com/mtshen/thinkNode/blob/master/docs/%E5%85%B3%E4%BA%8E.md)
 
 ------------------
 
 ## 参数参考
  #### option `think.opt(key, value)`

参数项(key) | 默认值(value) | 必选 | 说明
----------------|-------------------------------|-------|-----------------------------------
port            | 80                            | false |服务监听端口地址
ip	            | 0.0.0.0                       | false |服务监听IP地址, 一般不用设置
path            | /www                          | true  |网站根路径地址
default	        | ['index.html', 'index.htm']   | false |网站首页
staticReSource  | ['**/*.*']                    | false |可请的求文件限制条件
log_path        | /log                          | true  |日志存储目录
log_switch      | true                          | false |是否存储日志
user_path       | /user                         | true  |用户的node存储地址
user_exclude    |                               | false |排除一些node文件
debugger        | true                          | false |是否缓存文件
offsprDomain    | false                         | false |是否开启子域
host            | www                           | false |开启子域后默认显示的子域地址
https_switch    | false                         | false |是否开启https
https_port      | 443                           | false |https端口
https_key       | null                          | false |https CA私钥地址
https_cert      | null                          | false |https 通过CA私钥生成的CSR文件地址
https_pfx       | null                          | false |https 证书地址
https_pass      | null                          | false |https 证书密码
super           | false                         | false |是否开启多核模式
tool            | null                          | false |自定义的tool挂载

  #### lang `Think.lang(langName)`

语言名称| 对应的值(langName)
--------|---------
中文    | zh
英文    | en
