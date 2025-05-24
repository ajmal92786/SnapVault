function validateImageUrl(imageUrl) {
  return imageUrl.startsWith("https://images.unsplash.com/");
}

function validateTags(tags) {
  if (!Array.isArray(tags))
    return { valid: false, message: "Tags must be an array" };

  if (tags.length > 5)
    return { valid: false, message: "No more than 5 tags allowed" };

  for (const tag of tags) {
    if (tag.trim().length === 0) {
      return { valid: false, message: `Tags must be non-empty string` };
    }
    if (tag.length > 20) {
      return { valid: false, message: `Tag "${tag}" exceeds 20 characters` };
    }
  }

  return { valid: true };
}

module.exports = { validateImageUrl, validateTags };
