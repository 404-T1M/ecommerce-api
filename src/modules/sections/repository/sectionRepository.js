const Section = require("../model/sectionModel");

class SectionRepository {
  async create(sectionData) {
    return await Section.create(sectionData);
  }

  async find(filter, options = {}, sort = { order: 1 }) {
    let query = Section.find(filter).sort(sort);

    if (options.page && options.limit) {
      query = query.skip((options.page - 1) * options.limit).limit(options.limit);
    }

    if (options.populateCreatedBy) {
      query = query.populate("createdBy", "name email");
    }

    return await query;
  }

  async findOne(filter, options = {}) {
    let query = Section.findOne(filter);

    if (options.populateCreatedBy) {
      query = query.populate("createdBy", "name email");
    }

    return await query;
  }

  async count(filter) {
    return await Section.countDocuments(filter);
  }

  async deleteOne(filter) {
    return await Section.deleteOne(filter);
  }

  async updateOne(filter, updates) {
    return await Section.findOneAndUpdate(filter, updates, {
      new: true,
      runValidators: true,
    });
  }

  async checkValidData(repo, ids, filter) {
    if (!Array.isArray(ids) || ids.length === 0) return [];

    const documents = await repo.find(
      { _id: { $in: ids }, ...filter },
      { _id: 1 }
    );

    const existingIdSet = new Set(documents.map((doc) => String(doc._id)));

    const validIds = ids.filter((id) => existingIdSet.has(String(id)));
    return validIds;
  }
}
module.exports = SectionRepository;
