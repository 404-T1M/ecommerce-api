const ProductVariantRepository = require("../../repositories/productVariantRepository");
const {
  assertAdminPermission,
} = require("../../../../core/authorization/checkAdminAndHisPermission");

class GetProductFilterOptionsUseCase {
  constructor() {
    this.variantRepo = new ProductVariantRepository();
  }

  async execute(loggedInUser, filter = {}) {
    if (loggedInUser?.role === "admin") {
      await assertAdminPermission(loggedInUser, "products.list");
    }

    const variantMatch = {};

    if (!loggedInUser || loggedInUser.role !== "admin") {
      variantMatch.published = true;
      variantMatch.isDeleted = false;
    } else {
      if (filter.published !== undefined)
        variantMatch.published = filter.published;
      if (filter.isDeleted !== undefined)
        variantMatch.isDeleted = filter.isDeleted;
    }

    const productMatch = {};

    if (filter.category) {
      productMatch["product.category"] = filter.category;
    }

    if (!loggedInUser || loggedInUser.role !== "admin") {
      productMatch["product.published"] = true;
      productMatch["product.isDeleted"] = false;
    } else {
      if (filter.productPublished !== undefined)
        productMatch["product.published"] = filter.productPublished;
      if (filter.productIsDeleted !== undefined)
        productMatch["product.isDeleted"] = filter.productIsDeleted;
    }

    const { attributes, priceRange } =
      await this.variantRepo.getAvailableFilterOptions(
        variantMatch,
        productMatch,
      );

    const sortOptions = [
      { key: "newest", label: { en: "Newest", ar: "الأحدث" } },
      { key: "oldest", label: { en: "Oldest", ar: "الأقدم" } },
      {
        key: "price_asc",
        label: { en: "Price: Low → High", ar: "السعر: الأقل أولاً" },
      },
      {
        key: "price_desc",
        label: { en: "Price: High → Low", ar: "السعر: الأعلى أولاً" },
      },
    ];

    return {
      attributes,
      priceRange,
      sortOptions,
    };
  }
}

module.exports = GetProductFilterOptionsUseCase;
