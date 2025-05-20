function validateNewTags(tags) {
  if (!Array.isArray(tags)) {
    return { valid: false, message: "Tags must be an array" };
  }

  for (const tag of tags) {
    if (typeof tag !== "string" || tag.trim().length === 0) {
      return { valid: false, message: "Tags must be non-empty strings" };
    }
  }

  return { valid: true };
}

module.exports = { validateNewTags };
