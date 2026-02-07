const userRepository = require("../repositories/userRepository");
const User = require("../entities/userEntity");
const AppError = require("../../../core/errors/appError");
const { hashingCodes } = require("../../../shared/utils/codeHasher");
const { codeGeneration } = require("../../../shared/utils/codeGeneration");
const EmailService = require("../../../shared/services/emailService");

class resendVerificationCodeUseCase {
  constructor() {
    this.userRepo = new userRepository();
    this.emailSender = new EmailService();
  }

  async execute({ email }) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new AppError("User Not Found", 404);
    }

    const userEntity = new User(user);
    userEntity.activeUser();

    if (user.emailVerified) {
      throw new AppError("Already Verified", 400);
    }

    const code = codeGeneration();
    const hashedCode = await hashingCodes(code);

    await this.userRepo.updateOne(
      { _id: user._id },
      {
        verificationCode: hashedCode,
        verificationCodeExpire: Date.now() + 1000 * 60 * 10,
      },
    );

    await this.emailSender.sendEmail(
      user.email,
      "Email Verification Code",
      `
        <h2>Verification Code</h2>
        <p>Your verification code is:</p>
        <h3>${code}</h3>
        <p>This code will expire in 10 minutes.</p>
      `,
    );
  }
}

module.exports = resendVerificationCodeUseCase;
