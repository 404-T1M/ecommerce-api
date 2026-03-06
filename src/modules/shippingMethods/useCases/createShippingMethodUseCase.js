const AppError = require("../../../core/errors/appError");
const ShippingMethodRepository = require("../repositories/shippingMethodRepository");
const ImageService = require("../../../shared/services/imageUploadService");
const {
  assertAdminPermission,
} = require("../../../core/authorization/checkAdminAndHisPermission");

class CreateShippingMethodUseCase {
  constructor() {
    this.shippingMethodRepo = new ShippingMethodRepository();
  }

  async execute(loggedInUser, body, imageFile) {
    await assertAdminPermission(loggedInUser, "shippingMethods.create");

    const { name, description, price, estimatedDeliveryDays, isActive } = body;

    if (!name || price == null) {
      throw new AppError("Name and Price are required", 400);
    }

    if (price < 0) {
      throw new AppError("Price must be 0 or greater", 400);
    }

    if (estimatedDeliveryDays != null && estimatedDeliveryDays < 0) {
      throw new AppError("Estimated delivery days must be 0 or greater", 400);
    }

    const existing = await this.shippingMethodRepo.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });
    if (existing) {
      throw new AppError("A shipping method with this name already exists", 400);
    }

    let imageData = null;
    try {
      if (imageFile) {
        imageData = await ImageService.uploadSingle({
          file: imageFile,
          folder: "shipping-methods",
        });
      }

      const shippingMethod = await this.shippingMethodRepo.create({
        name,
        description,
        price,
        estimatedDeliveryDays,
        isActive: isActive ?? true,
        image: imageData
          ? { fileName: imageData.publicId, size: imageData.size }
          : undefined,
        createdBy: loggedInUser.id,
      });

      return shippingMethod;
    } catch (error) {
      if (imageData?.publicId) {
        await ImageService.delete(imageData.publicId);
      }
      throw error;
    }
  }
}

module.exports = CreateShippingMethodUseCase;
