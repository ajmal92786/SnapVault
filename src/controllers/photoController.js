const { searchImages } = require("../services/photoService");

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

module.exports = { searchPhotos };
