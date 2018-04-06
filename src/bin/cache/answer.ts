/**
 * think 子域名模块
 * 该模块可以轻松的实现二级, 三级甚至更多的域名
 */

// 加载模块
import * as fs from 'fs';
import * as path from 'path';
import think from './../think';
import * as cluster from 'cluster';

// 用户接口地址, 开启子域后只针对www域名生效
const {option, tool} = think;
const __ISMASTER: boolean = cluster.isMaster;

// 设置常量
const THINK_USER_PATH: string = option.user.path; // d:/user/
const THINK_USER_EXCLUED: RegExp = think.option.user.exclude; // 文件排除正则
const THINK_OFFSPRDOMAIN: boolean = think.option.offsprdomain; // 是否子域
const THINK_PATH: string = think.option.path; // 文件地址

// 存储队列
const Answer: Map<string, any> = new Map;

// 创建route目录,
// 这一步只是为了防止文件夹未创建而导致的异常
tool.createFilesSync(THINK_USER_PATH);
tool.createFilesSync(THINK_PATH);

// 根据地址获取相关js地址, 文件信息, 以及相关函数, 存储到Answer中
// 如果开启了子域, 这里是个回调, 子域应该不会太多, 太多的话目前的设计估计也不行
function initUserRoute(AnswerMap: Map<string, any>, userPath: string) {
	// 默认参数
	userPath = userPath || THINK_PATH;

	// 检查子域是否生效
	if (THINK_OFFSPRDOMAIN) {

		// 检查文件是否存在
		if (fs.existsSync(userPath)) {

			// 存在, 遍历, 每个子域目录
			let stats = fs.readdirSync(userPath);

			AnswerMap.set('child', []);
			stats.forEach((stat) => {
				// 创建子域
				let childMap: Map<string, any> = new Map;
				// 子域位置信息
				let fileName: string = path.join(userPath, stat);
				// 子域目录信息
				let statInfo = fs.statSync(fileName);
				
				// 是否是一个目录
				if (statInfo.isDirectory()) {
					// 子域配置信息
					let optPath: string = path.join(fileName, 'option.json');
					let ifStatPath: boolean = fs.existsSync(optPath);
					let option: any = {};
					ifStatPath && (option = require(optPath));
					
					// 存储目录信息
					childMap.set('fileInfo', statInfo);
					childMap.set('fileUrl', fileName);
					childMap.set('option', option);
					childMap.set('name', stat);

					// 查询是否存在子域
					let {offsprDomain = false}: {offsprDomain: boolean} = option;

					if (offsprDomain)
						initUserRoute(childMap, fileName);
					else {
						let childUserPath: string = path.join(fileName, (option.user || {}).path);
						childUserPath && initUserFilesRoute(childMap, childUserPath);
					}

					AnswerMap.get('child').push(childMap);
				};
			});
		} else {
			__ISMASTER && console.log((userPath as any).error);
		}
		return;
	} else {

		// 自动存储内容
		let wwwMap: Map<string, any> = new Map;
		try {
			let statInfo = fs.statSync(THINK_USER_PATH);
			wwwMap.set('fileInfo', statInfo);
		} catch (error) {
			// TODO 文件读取异常, 一般不会进到这里
			__ISMASTER && (think.log(THINK_USER_PATH, error),
				console.log((THINK_USER_PATH as any).error),
				console.log(think.info('loadNodeFiles').error));
		}

		// 设置文件信息, 地址, option等
		wwwMap.set('fileUrl', THINK_USER_PATH);
		wwwMap.set('name', 'www');
		wwwMap.set('option', think.option);
		AnswerMap.set('child', [wwwMap]);
		initUserFilesRoute(wwwMap, THINK_USER_PATH);
	}
		
};

// 取子域下内容
// 是个回调函数
function initUserFilesRoute(AnswerMap: Map<string, any>, userPath: string) {
	if(!fs.existsSync(userPath)) return null;
    let stats = fs.readdirSync(userPath);
	AnswerMap.set('nodeList', []);
	stats.forEach((stat) => {
		let filePath: string = path.join(userPath, stat);
		
		// 屏蔽某些文件的预加载, 能有效提高性能
		if ( THINK_USER_EXCLUED && THINK_USER_EXCLUED.test(stat)) {
			return true;
		}

		let fileInfo = fs.statSync(filePath);
		if (fileInfo.isFile()) {
			// 不加载非js文件
			if (!stat.endsWith('.js')) {
				return true;
			}

			let nodeInfo = new Map;
			nodeInfo.set('filePath', filePath);
			nodeInfo.set('fileInfo', fileInfo);
			nodeInfo.set('nodeList', []);
			// 定义域缓存
			think.$$NODE_CACHE_MAP = nodeInfo;
			
			try {
				// 加载用户的node
				require(filePath.replace(/\.js$/, ''));
				AnswerMap.get('nodeList').push(nodeInfo);
				__ISMASTER && console.log((filePath as any).file);
			} catch (error) {
				// TODO 用户node发生错误
				__ISMASTER && (think.log(filePath, error), 
					console.log(think.info('loadFileError').error), 
					console.log((filePath as any).error));
			};
			
			// 结束域缓存
			delete think.$$NODE_CACHE_MAP;
		} else if (fileInfo.isDirectory()) {
			// 文件夹
			initUserFilesRoute(AnswerMap, filePath)
		}
    });
}

/**
 * 入口函数
 * @param {string | object} url 接口地址
 * @param {string} type 		请求类型
 * @param {function} callback 	回调函数
 * @param {string} ContentType 	返回的ContentType值
 * @param {string} priority  	接口优先级
 */
let main: any = (url: any, ContentType: any, callback: Function): string => {
	url = url || {};
	let answerOption: any = {};
	typeof url === 'string' && (answerOption.url = url);
	typeof url === 'object' && (answerOption = url);
	typeof callback === 'function' && (answerOption.callback = callback);
	ContentType && (answerOption.ContentType = ContentType);
	let _url: string = answerOption.url;

	if (!_url && !think.$$NODE_CACHE_MAP) return null;
	think.$$NODE_CACHE_MAP.get('nodeList').push(answerOption);
	return _url;
};

main.proto = Answer;

// 初始化数据
think.answer = main;
 
__ISMASTER && console.log(think.info('loadAnswer'));
initUserRoute(Answer, THINK_PATH);

// 获取数据
think.getAnswer = (host: string) => {
	// 这一步, 会是host是一个始终可解析的host地址
	/^\d{1,4}\.\d{1,4}\.\d{1,4}\.\d{1,4}$/.test(host) && 
		(host = think.option.host + '.x.x');

	let hostArr: string[] = THINK_OFFSPRDOMAIN ? host.split('.') : ['www', '', ''];
	let rtnanswer: Map<string, any> = Answer;
	let seek: boolean = false;

	for (let i = hostArr.length - 3; i >= 0; i--) {
		let rtnanswerArr = rtnanswer.get('child') || [];
		for (let j = rtnanswerArr.length - 1; j >= 0; j --) {
			let name = rtnanswerArr[j].get('name');
			if (name === hostArr[i]) {
				rtnanswer = rtnanswerArr[j];
				seek = true;
				break;
			}
		}
		if (!rtnanswer) return null;	
	}
	let rtnChild = rtnanswer.get('child');
	if (rtnChild) rtnanswer = getHostDef(rtnanswer);
	return (seek ? rtnanswer : null);
}

// 根据option获取下级host answer
function getHostDef(answer: Map<string, any>) {
	if (!answer) return null;
	let option = answer.get('option') || {};
	let child = answer.get('child');
	let {offsprdomain, host} = option;
	if (!child && !offsprdomain) 
		return answer;
	else 
		for (let i = child.length - 1; i >= 0; i --) {
			if (child[i].name === host)
				return getHostDef(child[i].name);
		}
}