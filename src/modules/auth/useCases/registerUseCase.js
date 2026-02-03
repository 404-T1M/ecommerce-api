const User = require("../entities/userEntity");
const userRepository = require("../repositories/userRepository");
const AppError = require("../../../core/errors/appError");
const { hashingPassword } = require("../../../shared/utils/passwordHasher");
const { codeGeneration } = require("../../../shared/utils/codeGeneration");
const EmailService = require("../../../shared/services/emailService");

class RegisterUseCase {
  async execute(data) {
    // instance
    const userRepo = new userRepository();
    const emailSender = new EmailService();
    
    // Check Email
    const existingUser = await userRepo.findByEmail(data.email);
    if (existingUser) {
      throw new AppError("User Already Exists", 400);
    }

    const hashedPassword = await hashingPassword(data.password);
    const code = codeGeneration();

    const user = new User({
      ...data,
      password: hashedPassword,
      code,
    });

    const savedUser = await userRepo.save(user);
    
    await emailSender.sendVerificationEmail(
      data.email,
      "Email Verification Code",
      `
        <h2>Your Verification Code</h2>
        <p>Your verification code is:</p>
        <h3>${code}</h3>
        <p>This code will expire in 10 minutes.</p>
      `,
    );
    return savedUser;
  }
}

module.exports = RegisterUseCase;
