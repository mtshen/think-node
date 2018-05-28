"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 每次调用获取一个唯一ID
 */
function jarvisId(len, radix) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    // 默认值
    len = len || 8, radix = radix || chars.length;
    let uuid = [], index;
    for (index = 0; index < len; index++) {
        uuid[index] = chars[0 | Math.random() * radix];
    }
    return uuid.join('');
}
exports.default = jarvisId;
