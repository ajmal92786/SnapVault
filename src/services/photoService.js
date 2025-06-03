const axios = require("axios");
const { photo, tag, searchHistory } = require("../../models");

const searchImages = async (query) => {
  const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

  if (!UNSPLASH_ACCESS_KEY) {
    throw new Error("Unsplash API key is missing from environment variables");
  }

  try {
    const response = await axios.get("https://api.unsplash.com/search/photos", {
      params: { query },
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });

    if (response.data.results.length === 0) {
      return { message: "No images found for the given query." };
    }

    const photos = response.data.results.map((photo) => {
      return {
        imageUrl: photo.urls?.regular || "",
        description: photo.description || "",
        altDescription: photo.alt_description || "",
      };
    });

    return { photos };
  } catch (error) {
    console.error("Unsplash API Error:", error.message);
    throw new Error("Failed to fetch images from Unsplash");
  }
};

const savePhotoWithTags = async ({
  imageUrl,
  description,
  altDescription,
  tags,
  userId,
}) => {
  const newPhoto = await photo.create({
    imageUrl,
    description,
    altDescription,
    userId,
  });

  if (tags?.length) {
    const tagsData = tags.map((tag) => ({
      name: tag,
      photoId: newPhoto.id,
    }));

    await tag.bulkCreate(tagsData);
  }

  return newPhoto;
};

const retrievePhotosByTag = async (tagName, sort, userId) => {
  // Store the search in history
  if (userId) {
    const existingQuery = await searchHistory.findOne({
      where: { userId, query: tagName },
    });

    if (!existingQuery) {
      await searchHistory.create({ userId, query: tagName });
    }
  }

  // Find all tags matching the query
  const matchingTags = await tag.findAll({ where: { name: tagName } });

  if (!matchingTags.length) return [];

  const photoIds = matchingTags.map((t) => t.photoId);

  const photos = await photo.findAll({
    where: { id: photoIds },
    include: [
      {
        model: tag,
        attributes: ["name"],
      },
    ],
    order: [["dateSaved", sort.toUpperCase()]],
  });

  // Format the data
  return photos.map((p) => ({
    imageUrl: p.imageUrl,
    description: p.description,
    dateSaved: p.dateSaved,
    tags: p.tags.map((t) => t.name),
  }));
};

module.exports = { searchImages, savePhotoWithTags, retrievePhotosByTag };
