const { log } = require("async");
var MysqlService = require("./DBService");
var Utils = require("./Utils");

class FeatureService {
    constructor() {}

    getAllFeatures() {
        let db = new MysqlService();
        let sql = "select * from feature";
        return new Promise(function(resolve, reject) {
            db.query(sql, []).then(function(result) {
                return resolve(result);
            });
        });
    }


    getFeatureByIds(id_list) {
        let me = this;
        let db = new MysqlService();
        let sql = "select * from feature where id in (?)";
        console.log("id_list");
        console.log(id_list);
        return new Promise((resolve, reject) => {
            db.query(sql, [id_list]).then(result => {
                return resolve(result);
            });
        });
    }



    addFeature(feature) {
        let me = this;
        let db = new MysqlService();
        let sql = "insert into feature (name,url,icon,leaf,parent_id,panel ) values(?,?,?,?,?,?)";
        let insertFeature = [
            feature.name,
            feature.url,
            feature.icon,
            feature.leaf,
            feature.parent_id,
            feature.panel

        ];

        return me.isExist(feature).then(result => {
            console.log(result);
            if (result == false) {
                return new Promise((resolve, reject) => {
                    db.query(sql, insertFeature).then((err, result) => {
                        if (err) {
                            return resolve(err);
                        } else {
                            return resolve(result);
                        }
                    });
                });
            } else {
                return new Promise((resolve, reject) => {
                    return resolve("功能已存在");
                });
            }
        });
    }

    deleteFeature(feature) {
        let db = new MysqlService();
        let sql = "delete from feature where id=?";
        return new Promise((resolve, reject) => {
            db.query(sql, [feature.id]).then(result => {
                return resolve(result);
            });
        });
    }

    saveFeature(feature) {
        let db = new MysqlService();
        let sql = "update  feature set name=?,url=?,icon=?,leaf=?,parent_id=?,panel=? where id=?";
        return new Promise((resolve, reject) => {
            db.query(sql, [feature.name, feature.url, feature.icon, feature.leaf, feature.parent_id, feature.panel, feature.id]).then(
                result => {
                    return resolve(result);
                }
            );
        });
    }

    isExist(feature) {
        return new Promise((resolve, reject) => {


            let features;
            this.getAllFeatures().then(result => {
                features = result;
                //  console.log(features);
                let flag = false;
                for (let index in features) {
                    if (feature.name === features[index].name) {
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

module.exports = FeatureService;