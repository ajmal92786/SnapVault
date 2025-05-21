const { searchHistory } = require("../../models");

const getSearchHistoryByUserId = async (userId) => {
  const history = await searchHistory.findAll({
    where: { userId },
    attributes: ["query", "timestamp"],
  });

  return history;
};

module.exports = { getSearchHistoryByUserId };
