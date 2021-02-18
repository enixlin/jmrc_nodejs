var MysqlService = require("./DBService");
var Utils = require("./Utils");

class RolerService {
    constructor() {}

    getAllRolers() {
        let db = new MysqlService();
        let sql = "select * from roler";
        return new Promise(function(resolve, reject) {
            db.query(sql, []).then(function(result) {
                return resolve(result);
            });
        });
    }

    addRoler(roler) {
        let me = this;
        let db = new MysqlService();
        let sql = "insert into roler (name ) values(?)";
        return me.isExist(roler).then((result) => {
            if (result == false) {
                return new Promise((resolve, reject) => {
                    db.query(sql, [roler.name]).then((err, result) => {
                        if (err) {
                            return resolve(err);
                        } else {
                            return resolve(result);
                        }
                    });
                });
            } else {
                return new Promise((resolve, reject) => {
                    return resolve("角色已存在");
                });
            }
        });
    }

    deleteRoler(roler) {
        let db = new MysqlService();
        let sql = "delete from roler where id=?";
        return new Promise((resolve, reject) => {
            db.query(sql, [roler.id]).then((result) => {
                return resolve(result);
            });
        });
    }

    saveRoler(roler) {
        let db = new MysqlService();
        let sql = "update  roler set name=? where id=?";
        return new Promise((resolve, reject) => {
            db.query(sql, [roler.name, roler.id]).then((result) => {
                return resolve(result);
            });
        });
    }

    //取得角色的功能
    getRolerFeatures(roler) {
        let db = new MysqlService();
        let sql = "select * from roler_feature where roler_id=?";
        return new Promise((resolve, reject) => {
            db.query(sql, [roler.id]).then((result) => {
                return resolve(result);
            });
        });
    }

    //取得角色的功能
    getRolersFeatures(roler_id_list) {
        let db = new MysqlService();
        let sql = "select * from roler_feature where roler_id in (?)";
        return new Promise((resolve, reject) => {
            db.query(sql, [roler_id_list]).then((result) => {
                return resolve(result);
            });
        });
    }

    //设置角色的功能
    setRolerFeatures(params) {
        let db = new MysqlService();
        let sql = "insert into roler_feature (roler_id,feature_id) values ? ";
        console.log(params);
        return new Promise((resolve, reject) => {
            db.query(sql, [params]).then(result => {
                console.log(result);
                return resolve(result);
            });
        });
    }

    // 删除角色的功能
    delRolerFeature(roler) {
        let db = new MysqlService();
        let sql = "delete from roler_feature where roler_id=?";
        console.log(roler);
        return new Promise((resolve, reject) => {
            db.query(sql, [roler.id]).then(result => {
                console.log(result);
                return resolve(result);
            });
        });
    }



    isExist(checkRoler) {
        return new Promise((resolve, reject) => {
            let rolers;
            this.getAllRolers().then((result) => {
                rolers = result;
                let flag = false;
                for (let index in rolers) {
                    if (checkRoler.name === rolers[index].name) {
                        flag = true;
                    }
                }
                if (flag == true) {
                    return resolve(true);
                } else {
                    return resolve(false);
                }
            });
        });
    }
}

module.exports = RolerService;