// 加载模块
const fs = require('fs');
const path = require('path');

// 用户接口地址, 开启子域后只针对www域名生效
const $userPath = Think.option.user.path; // d:/user/
const $exclude = Think.option.user.exclude;
// 是否子域
const $offsprdomain = Think.option.offsprdomain;
// 文件地址
const $path = Think.option.path;
// 存储队列
const Answer = new Map;

const {tool} = Think;

// 创建route目录
tool.createFilesSync($userPath);
tool.createFilesSync($path);

// 根据地址获取相关js地址, 文件信息, 以及相关函数, 存储到Answer中
function initUserRoute(AnswerMap, userPath = $path) {
	// 检查子域是否生效
	if ($offsprdomain) {
		let ifPath = fs.existsSync(userPath);
		if (ifPath) {
			// 存在, 遍历, 每个子域目录
			let stats = fs.readdirSync(userPath);
			AnswerMap.set('child', []);
			stats.forEach((stat) => {
				// 创建子域
				let childMap = new Map;
				// 子域位置信息
				let fileName = path.join(userPath, stat);
				// 子域目录信息
				let statInfo = fs.statSync(fileName);
				
				if (statInfo.isDirectory()) {
					// 子域配置信息
					let optPath = path.join(fileName, 'option.json');
					let ifStatPath = fs.existsSync(optPath);
					let option = {};
					ifStatPath && (option = require(optPath));
					
					// 存储目录信息
					childMap.set('fileInfo', statInfo);
					childMap.set('fileUrl', fileName);
					childMap.set('option', option);
					childMap.set('name', stat);
					// 查询是否存在子域
					let {offsprDomain = false} = option;

					if (offsprDomain)
						initUserRoute(childMap, fileName);
					else {
						let childUserPath = path.join(fileName, (option.user || {}).path);
						childUserPath && initUserFilesRoute(childMap, childUserPath);
					}

					AnswerMap.get('child').push(childMap);
				};
			});
		} else {
			__ISMASTER && console.log(userPath.error);
		}
		return;
	} else {
		// 自动存储内容
		let wwwMap = new Map
		try {
			let statInfo = fs.statSync($userPath);
			wwwMap.set('fileInfo', statInfo);
		} catch (error) {
			// TODO
			
			__ISMASTER && (Think.log($userPath, error),
				console.log($userPath.error),
				console.log(ThinkInfo('loadNodeFiles').error));
		}
		wwwMap.set('fileUrl', $userPath);
		wwwMap.set('name', 'www');
		wwwMap.set('option', Think.option);
		AnswerMap.set('child', [wwwMap]);
		initUserFilesRoute(wwwMap, $userPath);
	}
		
};

// 取子域下内容
function initUserFilesRoute(AnswerMap, userPath) {
	if(!fs.existsSync(userPath)) return null;
    let stats = fs.readdirSync(userPath);
	AnswerMap.set('nodeList', []);
	stats.forEach((stat) => {
		let filePath = path.join(userPath, stat);
		
		// 屏蔽某些文件的预加载, 能有效提高性能
		if ( $exclude && $exclude.test(stat)) {
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
			Think.$$NODE_CACHE_MAP = nodeInfo;
			
			try {
				require(filePath.replace(/\.js$/, ''));
				AnswerMap.get('nodeList').push(nodeInfo);
				__ISMASTER && console.log(filePath.file);
			} catch (error) {
				// TODO
				__ISMASTER && (Think.log(filePath, error), 
					console.log(ThinkInfo('loadFileError').error), 
					console.log(filePath.error));
			};
			
			// 结束域缓存
			delete Think.$$NODE_CACHE_MAP;
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
let main = (url = {}, ContentType, callback) => {
	answerOption = {};
	typeof url === 'string' && (answerOption.url = url);
	typeof url === 'object' && (answerOption = url);
	typeof callback === 'function' && (answerOption.callback = callback);
	ContentType && (answerOption.ContentType = ContentType);
	let _url = answerOption.url;

	if (!_url && !Think.$$NODE_CACHE_MAP) return null;
	Think.$$NODE_CACHE_MAP.get('nodeList').push(answerOption);
	return _url;
};

main.proto = () => Answer;

// 初始化数据
Think.answer = main;
 
__ISMASTER && console.log(ThinkInfo('loadAnswer'));
initUserRoute(Answer, $path);

// 获取数据
Think.getAnswer = (host) => {
	if (typeof host !== 'string') return null;

	/^\d{1,4}\.\d{1,4}\.\d{1,4}\.\d{1,4}$/.test(host) && 
		(host = Think.option.host + '.x.x');

	let hostArr = $offsprdomain ? host.split('.') : ['www', '', ''];
	let rtnanswer = Answer;
	let seek = false;
	for (let i = hostArr.length - 3; i >= 0; i--) {
		rtnanswerArr = rtnanswer.get('child') || [];
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
function getHostDef(answer) {
	if (!answer) return null;
	let option = answer.get('option') || {};
	let child = answer.get('child');
	let {offsprdomain, host} = option;
	if (!child && !offsprdomain) 
		return answer;
	else 
		for (let i = child.length - 1; i >= 0; i --)
		if (child[i].name === host)
		return getHostDef(child[i].name);
}