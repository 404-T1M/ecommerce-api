const { buildImageUrl } = require("../../../shared/utils/imageUrlBuilder");
class ProductResponseDTO {
  constructor(product) {
    this.id = product._id;
    this.name = product.name;
    this.description = product.description;
    this.images = (product.images || []).map((img) => ({
      fileName: img.fileName,
      imageSize: img.size,
      imageUrl: buildImageUrl(img.fileName, {
        crop: "fill",
        quality: "auto",
        fetch_format: "auto",
      }),
    }));

    this.category = product.category;
    this.attributes = product.attributes;
    this.price = product.price;
    this.discountPrice = product.discountPrice;
    this.published = product.published;
    this.sku = product.sku;
    this.stock = product.stock;
    this.createdBy = product.createdBy;
    this.createdAt = product.createdAt;
  }
}

module.exports = ProductResponseDTO;
