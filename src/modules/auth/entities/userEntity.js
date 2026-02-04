const { phoneFormate } = require("../../../shared/utils/phoneValidator");

class User {
  constructor({
    name,
    email,
    mobilePhone,
    password,
    googleId = null,
    verificationCode,
  }) {
    const formatePhone = phoneFormate(mobilePhone);
    this.name = name;
    this.email = email;
    this.mobilePhone = formatePhone;
    this.password = password;
    this.googleId = googleId;
    this.verificationCode = verificationCode;
    this.verificationCodeExpire = Date.now() + 1000 * 60 * 10;
  }
}
module.exports = User;
