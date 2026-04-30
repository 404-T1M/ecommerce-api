const SectionRepository = require("../repository/sectionRepository");
const GetForYouSectionUseCase = require("./getForYouSectionUseCase");
const ProductRepository = require("../../products/repositories/productRepository");
const BannerRepository = require("../../banners/repository/bannerRepository");
const CategoryRepository = require("../../categories/repositories/categoryRepository");
const SectionResponseDTO = require("../DTO/sectionResponseDTO");
class GetHomePageUseCase {
  constructor() {
    this.sectionRepo = new SectionRepository();
    this.bannerRepo = new BannerRepository();
    this.categoryRepo = new CategoryRepository();
    this.productRepo = new ProductRepository();
  }

  async execute(loggedInUser) {
    const hasItems = (items) => Array.isArray(items) && items.length > 0;

    const sections = await this.sectionRepo.find(
      { isActive: true },
      {},
      { order: 1 },
    );
    let sectionDTO = [];

    for (const section of sections) {
      section.data = section.data ?? {};
      switch (section.type) {
        case "hero_banner":
          const existBanners = await this.sectionRepo.checkValidData(
            this.bannerRepo,
            section.data.bannerIds,
            { isActive: true },
          );
          section.data.bannerIds = existBanners;
          await section.populate("data.bannerIds");
          if (hasItems(section.data.bannerIds)) {
            sectionDTO.push(new SectionResponseDTO(section));
          }
          break;

        case "slider":
          const existBannersInSlider = await this.sectionRepo.checkValidData(
            this.bannerRepo,
            section.data.bannerIds,
            { isActive: true },
          );
          section.data.bannerIds = existBannersInSlider;
          await section.populate("data.bannerIds");
          if (hasItems(section.data.bannerIds)) {
            sectionDTO.push(new SectionResponseDTO(section));
          }
          break;

        case "customCategoriesSection":
          const existCategories = await this.sectionRepo.checkValidData(
            this.categoryRepo,
            section.data.categoryIds,
            { published: true, isDeleted: false },
          );
          section.data.categoryIds = existCategories;
          await section.populate("data.categoryIds");
          if (hasItems(section.data.categoryIds)) {
            sectionDTO.push(new SectionResponseDTO(section));
          }
          break;

        case "customProductsSection":
          const existProducts = await this.sectionRepo.checkValidData(
            this.productRepo,
            section.data.productIds,
            { published: true, isDeleted: false },
          );
          section.data.productIds = existProducts;
          await section.populate("data.productIds");
          if (hasItems(section.data.productIds)) {
            sectionDTO.push(new SectionResponseDTO(section));
          }
          break;

        case "categories":
          const homepageCategories = await this.categoryRepo.find(
            { published: true, isDeleted: false, parent: null },
            { page: 1, limit: section.limit },
            { createdAt: -1 },
          );
          section.data.categoryIds = homepageCategories;
          if (hasItems(section.data.categoryIds)) {
            sectionDTO.push(new SectionResponseDTO(section));
          }
          break;

        case "productsWithOffers":
          const existProductsWithOffers = await this.productRepo.find(
            {
              "discountPrice.active": true,
              published: true,
              isDeleted: false,
            },
            { page: 1, limit: section.limit },
            {},
          );
          section.data.productIds = existProductsWithOffers;

          if (hasItems(section.data.productIds)) {
            sectionDTO.push(new SectionResponseDTO(section));
          }
          break;

        case "newArrivals":
          const existNewArrivals = await this.productRepo.find(
            { published: true, isDeleted: false },
            { page: 1, limit: section.limit },
            { createdAt: -1 },
          );
          section.data.productIds = existNewArrivals;

          if (hasItems(section.data.productIds)) {
            sectionDTO.push(new SectionResponseDTO(section));
          }
          break;

        case "topRatedProducts":
          const existTopRatedProducts = await this.productRepo.find(
            { published: true, isDeleted: false },
            { page: 1, limit: section.limit },
            { "rating.avg": -1 },
          );
          section.data.productIds = existTopRatedProducts;

          if (hasItems(section.data.productIds)) {
            sectionDTO.push(new SectionResponseDTO(section));
          }
          break;

        case "forYouRecommendations":
          const forYouSection = await new GetForYouSectionUseCase().execute(
            loggedInUser,
          );
          const forYouProducts = Array.isArray(forYouSection?.data?.products)
            ? forYouSection.data.products
            : Array.isArray(forYouSection?.data?.productIds)
              ? forYouSection.data.productIds
              : [];

          forYouSection.data.products = forYouProducts;

          if (hasItems(forYouProducts)) {
            sectionDTO.push(forYouSection);
          }
          break;

        case "mostSellingProducts":
          const existMostSellingProducts = await this.productRepo.find(
            { published: true, isDeleted: false },
            { page: 1, limit: section.limit },
            { soldCount: -1 },
          );
          section.data.productIds = existMostSellingProducts;
          if (hasItems(section.data.productIds)) {
            sectionDTO.push(new SectionResponseDTO(section));
          }
          break;

        default:
          break;
      }
    }
    return sectionDTO;
  }
}

module.exports = GetHomePageUseCase;
