const { photo, tag } = require("../../models");

const addTagsToPhoto = async (photoId, newTags) => {
  const targetPhoto = await photo.findByPk(photoId, {
    include: [{ model: tag }],
  });

  if (!targetPhoto) {
    throw new Error("Photo not found");
  }

  // Get existing tag names (lowercased for case-insensitive match)
  const existingTagNames = targetPhoto.tags.map((tag) =>
    tag.name.toLowerCase()
  );

  // Filter out duplicates
  const uniqueNewTags = newTags.filter(
    (tag) => !existingTagNames.includes(tag.toLowerCase())
  );

  const totalTagsAfterAddition = targetPhoto.tags.length + uniqueNewTags.length;
  if (totalTagsAfterAddition > 5) {
    throw new Error("Each photo can have a maximum of 5 tags");
  }

  const tagsData = uniqueNewTags.map((tag) => ({
    name: tag,
    photoId: targetPhoto.id,
  }));

  if (tagsData.length) {
    await tag.bulkCreate(tagsData);
  }

  return true;
};

module.exports = { addTagsToPhoto };
