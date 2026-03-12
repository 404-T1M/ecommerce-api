const AppError = require("../../../core/errors/appError");
const ShippingMethodRepository = require("../repositories/shippingMethodRepository");
const ImageService = require("../../../shared/services/imageUploadService");
const {
  assertAdminPermission,
} = require("../../../core/authorization/checkAdminAndHisPermission");

class UpdateShippingMethodUseCase {
  constructor() {
    this.shippingMethodRepo = new ShippingMethodRepository();
  }

  async execute(loggedInUser, shippingMethodId, body, imageFile) {
    await assertAdminPermission(loggedInUser, "shippingMethods.update");

    const shippingMethod = await this.shippingMethodRepo.findOne({
      _id: shippingMethodId,
    });
    if (!shippingMethod) {
      throw new AppError("Shipping Method Not Found", 404);
    }

    const updates = {};

    if (body.nameEn || body.nameAr) {
      const newNameEn = body.nameEn ?? shippingMethod.name.en;
      const newNameAr = body.nameAr ?? shippingMethod.name.ar;

      if (body.nameEn) {
        const existing = await this.shippingMethodRepo.findOne({
          "name.en": { $regex: `^${body.nameEn}$`, $options: "i" },
        });
        if (existing && existing._id.toString() !== shippingMethodId) {
          throw new AppError(
            "A shipping method with this name already exists",
            400,
          );
        }
      }

      updates.name = { en: newNameEn, ar: newNameAr };
    }

    if (body.descriptionEn !== undefined || body.descriptionAr !== undefined) {
      updates.description = {
        en: body.descriptionEn ?? shippingMethod.description?.en ?? null,
        ar: body.descriptionAr ?? shippingMethod.description?.ar ?? null,
      };
    }

    if (body.price != null) {
      if (body.price < 0) {
        throw new AppError("Price must be 0 or greater", 400);
      }
      updates.price = body.price;
    }

    if (body.estimatedDeliveryDays != null) {
      if (body.estimatedDeliveryDays < 0) {
        throw new AppError("Estimated delivery days must be 0 or greater", 400);
      }
      updates.estimatedDeliveryDays = body.estimatedDeliveryDays;
    }

    if (body.isActive != null) {
      updates.isActive = body.isActive;
    }

    const oldImageId = shippingMethod.image?.fileName;
    let imageData = null;

    try {
      if (imageFile) {
        imageData = await ImageService.uploadSingle({
          file: imageFile,
          folder: "shipping-methods",
        });
        updates.image = {
          fileName: imageData.publicId,
          size: imageData.size,
        };
      }

      const updated = await this.shippingMethodRepo.updateOne(
        { _id: shippingMethodId },
        updates,
      );

      // Delete old image from Cloudinary after successful update
      if (imageData && oldImageId) {
        await ImageService.delete(oldImageId);
      }

      return updated;
    } catch (error) {
      if (imageData?.publicId) {
        await ImageService.delete(imageData.publicId);
      }
      throw error;
    }
  }
}

module.exports = UpdateShippingMethodUseCase;
