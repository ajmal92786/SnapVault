const {
  getSearchHistoryByUserId,
} = require("../services/searchHistoryService");

const getUserSearchHistory = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ message: "Invalid or missing userId" });
    }

    const history = await getSearchHistoryByUserId(userId);

    if (history.length === 0) {
      return res
        .status(404)
        .json({ message: "No history found for userId: ", userId });
    }

    return res.status(200).json({ searchHistory: history });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

module.exports = { getUserSearchHistory };
