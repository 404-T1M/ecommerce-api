const { buildImageUrl } = require("../../../shared/utils/imageUrlBuilder");
class categoryDataResponseDTO {
  constructor(category) {
    this.id = category._id;
    this.name = category.name;
    this.slug = category.slug;
    this.description = category.description;
    this.parent = category.parent;
    this.order = category.order;
    this.published = category.published;
    this.image = {
      fileName: category.image.fileName,
      imageSize: category.image.size,
      imageUrl: buildImageUrl(category.image.fileName, {
        crop: "fill",
        quality: "auto",
        fetch_format: "auto",
      }),
    };
    this.isFeatured = category.isFeatured;
    this.createdBy = category.createdBy;
    this.createdAt = category.createdAt;
  }
}

module.exports = categoryDataResponseDTO;
