const {
  getSearchHistoryByUserId,
} = require("../../src/services/searchHistoryService");
const { searchHistory } = require("../../models");

jest.mock("../../models", () => ({
  searchHistory: {
    findAll: jest.fn(),
  },
}));

describe("Service: getSearchHistoryByUserId", () => {
  it("should return search history for a user", async () => {
    const mockHistory = [
      {
        query: "mountains",
        timestamp: "2024-01-01T12:00:00Z",
      },

      {
        query: "nature",
        timestamp: "2024-01-05T08:00:00Z",
      },
    ];

    searchHistory.findAll.mockResolvedValue(mockHistory);

    const result = await getSearchHistoryByUserId(1);
    expect(result).toEqual(mockHistory);
    expect(searchHistory.findAll).toHaveBeenCalledWith({
      where: { userId: 1 },
      attributes: ["query", "timestamp"],
    });
  });

  it("should return empty array if no records found", async () => {
    searchHistory.findAll.mockResolvedValue([]);
    const result = await getSearchHistoryByUserId(2);
    expect(result).toEqual([]);
  });
});
