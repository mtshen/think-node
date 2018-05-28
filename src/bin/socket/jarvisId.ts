/**
 * 每次调用获取一个唯一ID
 */
export default function jarvisId(len?: number, radix?: number): string {
    const chars: Array<string> = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    
    // 默认值
    len = len || 8, radix = radix || chars.length;
    
    let uuid: Array<string> = [],
        index: number;
   
    for (index = 0; index < len; index ++) {
        uuid[index] = chars[0 | Math.random() * radix];
    }

    return uuid.join('');
}