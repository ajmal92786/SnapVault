const axios = require("axios");

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

module.exports = { searchImages };
