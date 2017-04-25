const Answer = new Map;

/**
 * 入口函数
 * 可以以对象的方式传入, 也可以以url, type, data, callback的方式传入
 * @param {string | object} url 
 * @param {string} type 
 * @param {object} data 
 * @param {function} callback 
 */
let main = (url = {}, ContentType, callback) => {
	let answerOption = {};
	typeof url === 'string' && (answerOption.url = url);
	typeof url === 'object' && (answerOption = url);
	typeof callback === 'function' && (answerOption.callback = callback);
	ContentType && (answerOption.ContentType = ContentType);
	let _url = answerOption.url;
	if (!_url) return null;
	Answer.set(_url, answerOption);
	return _url;
};

// 根据url 来获取内容
main.get = (url) => {return Answer.get(url);};

module.exports = global.answer = main;
