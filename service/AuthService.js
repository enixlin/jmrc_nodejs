var DBService = require("./DBService");
var UserService = require("./UserService");

class AuthService {
  constructor() {}
  async authUser(user) {
    let userService = new UserService();
    let users = await userService.getAllUsers();
    return new Promise((resolve, reject) => {
      users.forEach(u => {
        if (u.name == user.name && u.password == user.password) {
          return resolve({ id: u.id, name: u.name, status: u.status });
        }
      });
      return resolve({});
    });
  }
}
module.exports = AuthService;
