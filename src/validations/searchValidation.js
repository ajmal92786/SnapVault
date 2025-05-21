const validateTagQuery = (tag) => {
  return typeof tag === "string" && tag.trim().length > 0;
};

const validateSortQuery = (sort) => {
  return ["ASC", "DESC"].includes(sort.toUpperCase());
};

module.exports = { validateTagQuery, validateSortQuery };
