const { photo, tag } = require("../../models");

const addTagsToPhoto = async (photoId, newTags) => {
  const targetPhoto = await photo.findByPk(photoId, {
    include: [{ model: tag }],
  });

  if (!targetPhoto) {
    throw new Error("Photo not found");
  }

  const existingTagCount = targetPhoto.tags.length;

  if (existingTagCount + newTags.length > 5) {
    throw new Error("'Each photo can have a maximum of 5 tags");
  }

  const tagsData = newTags.map((tag) => ({
    name: tag,
    photoId: targetPhoto.id,
  }));

  await tag.bulkCreate(tagsData);

  return true;
};

module.exports = { addTagsToPhoto };
