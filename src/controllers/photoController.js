const {
  searchImages,
  savePhotoWithTags,
  retrievePhotosByTag,
} = require("../services/photoService");
const { doesUserExistsById } = require("../services/userService");
const {
  validateImageUrl,
  validateTags,
} = require("../validations/photoValidations");
const {
  validateTagQuery,
  validateSortQuery,
} = require("../validations/searchValidation");

const searchPhotos = async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ message: "Search term (query) is required" });
  }

  try {
    const result = await searchImages(query);

    if (result.message) {
      return res.status(404).json({ message: result.message });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const savePhoto = async (req, res) => {
  const { imageUrl, description, altDescription, tags, userId } = req.body;

  // Validate userId
  if (!userId || typeof userId !== "number") {
    return res.status(400).json({ message: "Valid userId is required" });
  }

  // Check if user exists
  const userExists = await doesUserExistsById(userId);
  if (!userExists) {
    return res.status(404).json({ message: `User not found` });
  }

  // Validate image URL
  if (!validateImageUrl(imageUrl)) {
    return res.status(400).json({ message: "Invalid image URL" });
  }

  // Validate tags
  const tagValidation = validateTags(tags);
  if (!tagValidation.valid) {
    return res.status(400).json({ message: tagValidation.message });
  }

  try {
    await savePhotoWithTags({
      imageUrl,
      description,
      altDescription,
      tags,
      userId,
    });

    return res.status(201).json({ message: "Photo saved successfully" });
  } catch (error) {
    console.error("Error saving photo: ", error.message);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const searchPhotosByTag = async (req, res) => {
  const { tags, sort = "ASC", userId } = req.query;

  if (!validateTagQuery(tags)) {
    return res
      .status(400)
      .json({ message: "Tag is required and must be a non-empty string." });
  }

  if (!validateSortQuery(sort)) {
    return res
      .status(400)
      .json({ message: "Sort must be either ASC or DESC." });
  }

  try {
    const photos = await retrievePhotosByTag(tags, sort, userId);

    if (!photos.length) {
      return res
        .status(404)
        .json({ message: "No images found for the given tag." });
    }

    return res.status(200).json({ photos });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
};

module.exports = {
  searchPhotos,
  savePhoto,
  searchPhotosByTag,
};
