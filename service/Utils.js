const bcrypt = require("crypto");

class Utils {
  constructor() {}
  hashPassword(password) {
    return new Promise((resolve, reject) => {
      let hash = bcrypt.createHash("sha256");
      hash.update(password);
      return resolve(hash.digest("base64"));
    });
  }
}

module.exports = Utils;
