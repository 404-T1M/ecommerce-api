const CouponRepository = require("../repositories/couponRepository");
const CouponResponseDTO = require("../DTO/couponResponseDTO");
const {
  assertAdminPermission,
} = require("../../../core/authorization/checkAdminAndHisPermission");

class GetAllCouponUseCase {
  constructor() {
    this.couponRepo = new CouponRepository();
  }

  async execute(loggedInUser, filter) {
    await assertAdminPermission(loggedInUser, "coupons.list");

    let query = {};

    if (filter.isActive != null) {
      query.isActive = filter.isActive;
    }
    if (filter.code) {
      query.code = { $regex: filter.code, $options: "i" };
    }

    const coupons = await this.couponRepo.find(
      query,
      filter.sort,
      filter.page,
      filter.limit,
      { populateUsers: true },
    );
    return coupons.map((coupon) => new CouponResponseDTO(coupon));
  }
}
module.exports = GetAllCouponUseCase;
