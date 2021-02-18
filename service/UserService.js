var MysqlService = require("./DBService");
var Utils = require("./Utils");

class UserService {
    constructor() {}

    getAllUsers() {
        let db = new MysqlService();
        let sql = "select * from user";
        return new Promise(function(resolve, reject) {
            db.query(sql, []).then(function(result) {
                return resolve(result);
            });
        });
    }

    addUser(user) {
        let me = this;
        let db = new MysqlService();
        let sql = "insert into user (name ,password) values(?,?)";
        return me.isExist(user).then((result) => {
            if (result == false) {
                return new Promise((resolve, reject) => {
                    db.query(sql, [user.name, user.password]).then((err, result) => {
                        if (err) {
                            return resolve(err);
                        } else {
                            return resolve(result);
                        }
                    });
                });
            } else {
                return new Promise((resolve, reject) => {
                    return resolve("用户已存在");
                });
            }
        });
    }

    deleteUser(user) {
        let db = new MysqlService();
        let sql = "delete from user where id=?";
        return new Promise((resolve, reject) => {
            db.query(sql, [user.id]).then((result) => {
                return resolve(result);
            });
        });
    }

    saveUser(user) {
        let db = new MysqlService();
        let sql = "update  user set name=?,password=?,status=? where id=?";
        return new Promise((resolve, reject) => {
            db.query(sql, [user.name, user.password, user.status, user.id]).then(
                (result) => {
                    return resolve(result);
                }
            );
        });
    }

    // 取得用户的角色
    getUserRolers(user) {
            let db = new MysqlService();
            let sql = "select * from user_roler where user_id=?";
            console.log(user);
            return new Promise((resolve, reject) => {
                db.query(sql, [user.id]).then(result => {
                    console.log(result);
                    return resolve(result);
                });
            });
        }
        // 设置用户的角色
    setUserRolers(params) {
        let db = new MysqlService();
        let sql = "insert into user_roler (user_id,roler_id) values ? ";
        console.log(params);
        return new Promise((resolve, reject) => {
            db.query(sql, [params]).then(result => {
                console.log(result);
                return resolve(result);
            });
        });
    }

    // 删除用户的角色
    delUserRoler(user) {
        let db = new MysqlService();
        let sql = "delete from user_roler where user_id=?";
        console.log(user);
        return new Promise((resolve, reject) => {
            db.query(sql, [user.id]).then(result => {
                console.log(result);
                return resolve(result);
            });
        });
    }

    isExist(checkUser) {
        return new Promise((resolve, reject) => {
            let users;
            this.getAllUsers().then((result) => {
                users = result;
                let flag = false;
                for (let index in users) {
                    if (checkUser.name === users[index].name) {
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

module.exports = UserService;