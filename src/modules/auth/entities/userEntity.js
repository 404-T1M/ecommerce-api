const AppError = require("../../../core/errors/appError");

class User {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.mobilePhone = data.mobilePhone;
    this.password = data.password;
    this.googleId = data.googleId;
    this.emailVerified = data.emailVerified;
    this.status = data.status;
    this.verificationCode = data.verificationCode;
    this.verificationCodeExpire = data.verificationCodeExpire;
  }

  static createForRegister(data) {
    return new User({
      name: data.name,
      email: data.email.toLowerCase(),
      mobilePhone: data.mobilePhone,
      password: data.password,
      googleId: null,
      emailVerified: false,
      status: true,
      verificationCode: data.verificationCode,
      verificationCodeExpire: Date.now() + 1000 * 60 * 10,
    });
  }

  verifiedEmail() {
    if (!this.emailVerified) {
      throw new AppError("Email is not verified");
    }
  }

  activeUser() {
    if (!this.status) {
      throw new AppError("Account is disabled");
    }
  }
}

module.exports = User;
