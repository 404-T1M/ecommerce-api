const BannerRepository = require("../repository/bannerRepository");
const ImageService = require("../../../shared/services/imageUploadService");
const BannerResponseDTO = require("../DTO/bannerResponseDTO");

const AppError = require("../../../core/errors/appError");
const {
  assertAdminPermission,
} = require("../../../core/authorization/checkAdminAndHisPermission");
class UpdateBannerUseCase {
  constructor() {
    this.bannerRepo = new BannerRepository();
  }

  async execute(loggedInUser, bannerId, body, imageFile) {
    await assertAdminPermission(loggedInUser, "banners.update");

    const banner = await this.bannerRepo.findOne({ _id: bannerId });
    if (!banner) {
      throw new AppError("Banner Not Found", 404);
    }

    let oldImagePublicId = banner.image?.fileName;
    let newImageData = null;
    try {
      if (imageFile) {
        newImageData = await ImageService.uploadSingle({
          file: imageFile,
          folder: "banners",
        });
        banner.image = newImageData
          ? {
              fileName: newImageData.publicId,
              size: newImageData.size,
            }
          : banner.image;
      }

      if (body.titleEn) {
        banner.title.en = body.titleEn;
      }
      if (body.titleAr) {
        banner.title.ar = body.titleAr;
      }
      if (body.link !== undefined) {
        banner.link = body.link;
      }
      if (body.order !== undefined) {
        banner.order = body.order;
      }
      if (body.isActive !== undefined) {
        banner.isActive = body.isActive;
      }
      banner.updatedBy = loggedInUser.id;
      await banner.save();

      if (newImageData && oldImagePublicId) {
        await ImageService.delete(oldImagePublicId);
      }

      return new BannerResponseDTO(banner);
    } catch (error) {
      if (newImageData?.publicId) {
        await ImageService.delete(newImageData.publicId);
      }
      throw new AppError(error.message, 500);
    }
  }
}

module.exports = UpdateBannerUseCase;
