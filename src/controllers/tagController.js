const { addTagsToPhoto } = require("../services/tagService");
const { validateNewTags } = require("../validations/tagValidations");

const addPhotoTags = async (req, res) => {
  const { photoId } = req.params;
  const { tags } = req.body;

  // Tags validation
  const validation = validateNewTags(tags);
  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  try {
    await addTagsToPhoto(photoId, tags);
    return res.status(200).json({ message: "Tags added successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { addPhotoTags };
