/* 
Excel文件操作服务类
*/
var Excel = require('exceljs');



class excelService {
    // var workbook;
    constructor(fileName, sheetName) {
        this.workbook = new Excel.Workbook();
        this.fileName = fileName;
        this.sheet = this.workbook.addWorksheet(sheetName);
    };
    save() {
        console.log("保存文件...");
        this.workbook.xlsx.writeFile("public/" + this.fileName);
    };

    fillData(data) {
        console.log("fill data in cell");

        this.sheet.addRows(data);
        console.log("fillDate done");

    }

};



module.exports = excelService;