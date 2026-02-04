const User = require("../entities/userEntity");
const userRepository = require("../repositories/userRepository");
const RegisterResponseDTO = require("../DTO/authDto/RegisterResponseDTO");
const AppError = require("../../../core/errors/appError");
const { hashingPassword } = require("../../../shared/utils/passwordHasher");
const { hashingCodes } = require("../../../shared/utils/codeHasher");
const { codeGeneration } = require("../../../shared/utils/codeGeneration");
const EmailService = require("../../../shared/services/emailService");

class RegisterUseCase {
  constructor() {
    this.userRepo = new userRepository();
    this.emailSender = new EmailService();
  }

  async execute(data) {
    const existingUser = await this.userRepo.findByEmail(data.email);
    if (existingUser) {
      throw new AppError("Email already in use", 400);
    }

    const code = codeGeneration();
    const hashedPassword = await hashingPassword(data.password);
    const hashedCode = await hashingCodes(code);

    const user = new User({
      ...data,
      password: hashedPassword,
      verificationCode: hashedCode,
    });
    const savedUser = await this.userRepo.save(user);

    await this.emailSender.sendVerificationEmail(
      data.email,
      "Email Verification Code",
      `
        <h2>Verification Code</h2>
        <p>Your verification code is:</p>
        <h3>${code}</h3>
        <p>This code will expire in 10 minutes.</p>
      `,
    );
    return new RegisterResponseDTO(savedUser);
  }
}

module.exports = RegisterUseCase;
