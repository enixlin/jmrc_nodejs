var fs = require("fs");


/**
 * 文件快捷读写工具类
 */
class FileAccess {
    constructor() {
        fs.writeFileSync("./../writefile.txt", "enixlin");
    }


    writeFile() {
        fs.writeFileSync("./../writefile.txt", "enixlin");
    }


    readFile(){
        return fs.readFileSync("./../writefile.txt");
    }



}


module.exports = FileAccess;