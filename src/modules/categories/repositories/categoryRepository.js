const Category = require("../models/categoryModel");

class categoryRepository {
  buildQuery(filters) {
    const query = {};

    if (filters.published !== undefined) {
      query.published = filters.published;
    }

    if (filters.name) {
      query.$or = [
        { "name.en": { $regex: filters.name, $options: "i" } },
        { "name.ar": { $regex: filters.name, $options: "i" } },
      ];
    }

    if (filters.parent) {
      query.parent = filters.parent;
    }

    if (filters.fromDate || filters.toDate) {
      query.createdAt = {};
      if (filters.fromDate) {
        query.createdAt.$gte = new Date(filters.fromDate);
      }
      if (filters.toDate) {
        query.createdAt.$lte = new Date(filters.toDate);
      }
    }

    return query;
  }

  async find(filters, options = {}) {
    const query = this.buildQuery(filters);

    let mongooseQuery = Category.find(query);

    if (options.populateParent) {
      mongooseQuery = mongooseQuery.populate("parent", "name slug");
    }

    if (options.populateCreatedBy) {
      mongooseQuery = mongooseQuery.populate("createdBy", "name email");
    }

    return mongooseQuery
      .skip((filters.page - 1) * filters.limit)
      .limit(filters.limit);
  }

  async count(filters) {
    const query = this.buildQuery(filters);
    return Category.countDocuments(query);
  }

  async findOne(filter) {
    let query = Category.findOne(filter);
    return await query;
  }

  async create(category) {
    return await Category.create(category);
  }

  async updateOne(filter, updates) {
    return await Category.findOneAndUpdate(filter, updates, {
      new: true,
      runValidators: true,
    });
  }

  async deleteOne(filter) {
    return await Category.findOneAndDelete(filter);
  }
}

module.exports = categoryRepository;
