const Category = require("../models/categoryModel");

class categoryRepository {
  async findChildrenIds(parentId) {
    const children = await Category.find({ parent: parentId }, { _id: 1 });

    let ids = children.map((c) => c._id);

    for (const child of children) {
      const subChildrenIds = await this.findChildrenIds(child._id);
      ids = ids.concat(subChildrenIds);
    }

    return ids;
  }

  async find(filters, options = {}) {
    let query = Category.find(filters);

    if (options.populateParent) {
      query = query.populate("parent", "name slug");
    }

    if (options.populateCreatedBy) {
      query = query.populate("createdBy", "name email");
    }

    if (options.populateAttributes) {
      query = query.populate("attributes.attribute", "_id name type");
    }

    if (options.page && options.limit) {
      query = query
        .skip((options.page - 1) * options.limit)
        .limit(options.limit);
    }

    return query;
  }

  async count(filters) {
    return Category.countDocuments(filters);
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

  async updateMany(filter, update) {
    return await Category.updateMany(filter, update, {
      new: true,
      runValidators: true,
    });
  }

  async deleteOne(filter) {
    return await Category.findOneAndDelete(filter);
  }
}

module.exports = categoryRepository;
