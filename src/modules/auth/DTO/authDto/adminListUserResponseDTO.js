class AdminListUserResponseDTO {
  constructor(user) {
    this.id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.mobilePhone = user.mobilePhone;
    this.role = user.role;
    this.profileImage = user.profileImage;
    this.emailVerified = user.emailVerified;
    this.status = user.status;
    this.isDeleted = user.isDeleted;
    this.createdAt = user.createdAt;
  }
}

module.exports = AdminListUserResponseDTO;
