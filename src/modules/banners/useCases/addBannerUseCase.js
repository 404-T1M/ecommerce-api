const BannerRepository = require("../repository/bannerRepository");
const ImageService = require("../../../shared/services/imageUploadService");
const BannerResponseDTO = require("../DTO/bannerResponseDTO");
const AppError = require("../../../core/errors/appError");
const {
  assertAdminPermission,
} = require("../../../core/authorization/checkAdminAndHisPermission");
class AddBannerUseCase {
  constructor() {
    this.bannerRepo = new BannerRepository();
  }

  async execute(loggedInUser, body, imageFile) {
    await assertAdminPermission(loggedInUser, "banners.create");
    console.log("AddBannerUseCase body:", body);
    console.log("AddBannerUseCase file:", imageFile);
    const { titleEn, titleAr, order, link, isActive } = body;

    if (!titleEn || !titleAr) {
      throw new AppError("Title in both English and Arabic is required", 400);
    }

    let imageData = null;
    try {
      if (imageFile) {
        imageData = await ImageService.uploadSingle({
          file: imageFile,
          folder: "banners",
        });
      }

      const banner = await this.bannerRepo.create({
        title: { en: titleEn, ar: titleAr },
        link,
        image: imageData
          ? {
              fileName: imageData.publicId,
              size: imageData.size,
            }
          : null,
        order,
        isActive: isActive !== undefined ? isActive : true,
        createdBy: loggedInUser.id,
      });

      return new BannerResponseDTO(banner);
    } catch (error) {
      await ImageService.delete(imageData.publicId);
      throw new AppError("Image upload failed: " + error.message, 500);
    }
  }
}

module.exports = AddBannerUseCase;
