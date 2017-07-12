const path = require('path');
const fs = require('fs');
const lengPath = path.join(__dirname, Think.language + '.json');
__ISMASTER && console.log('load lang');

let lengInfo;
if (! fs.existsSync(lengPath)){
    __ISMASTER && console.log('The loading language failed. The language file did not exist!'.warning);
    __ISMASTER && console.log(lengPath.error);
    lengInfo = require(path.join(__dirname, 'zh.json'));
    __ISMASTER && console.log(lengInfo['loadLengN'].error);
} else {
    lengInfo = require(lengPath);
    __ISMASTER && console.log(lengInfo['loadLeng']);
    __ISMASTER && console.log('   ' + lengPath.file);
    __ISMASTER && console.log(lengInfo['loadLengY']);
}

module.exports = function(i) {
    let text = lengInfo[i];
    return text || '';
};