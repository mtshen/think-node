export default interface thinkInterFace {
    // 常量
    END: Symbol;
    NODATA: Symbol;
    DIR: string;
    Jarvis: any;

    // 变量
    headerInfo: any;
    timeInfo: string;
    option: any;
    tool: any;
    language: string;
    debugger: boolean;
    $$NODE_CACHE_MAP: any;
    answer: Map<string, any>;

    // 方法
    frontPath: Function;
    header: Function;
    timeZone: Function;
    opt: Function;
    define: Function;
    lang: Function;
    load: Function;
    onload: Function;
    log: Function;
    info: Function;
    voidCallback: Function;
    getCache: Function;
    getAnswer: Function;
};