const { searchImages, savePhotoWithTags } = require("../services/photoService");
const { doesUserExistsById } = require("../services/userService");
const {
  validateImageUrl,
  validateTags,
} = require("../validations/photoValidations");

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

module.exports = { searchPhotos, savePhoto };
