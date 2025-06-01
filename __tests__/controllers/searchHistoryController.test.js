const {
  getUserSearchHistory,
} = require("../../src/controllers/searchHistoryController");
const {
  getSearchHistoryByUserId,
} = require("../../src/services/searchHistoryService");

jest.mock("../../src/services/searchHistoryService", () => ({
  getSearchHistoryByUserId: jest.fn(),
}));

describe("Controller: getUserSearchHistory", () => {
  let req, res;

  beforeEach(() => {
    req = { query: { userId: "1" } };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return 200 and search history if found", async () => {
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

    getSearchHistoryByUserId.mockResolvedValue(mockHistory);
    await getUserSearchHistory(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ searchHistory: mockHistory });
  });

  it("should return 400 if userId is missing or invalid", async () => {
    req.query.userId = "";

    await getUserSearchHistory(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid or missing userId",
    });
  });

  it("should return 404 if no history found", async () => {
    getSearchHistoryByUserId.mockResolvedValue([]);

    await getUserSearchHistory(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "No history found for userId: 1",
    });
  });

  it("should handle server error", async () => {
    getSearchHistoryByUserId.mockRejectedValue(new Error("DB error"));
    await getUserSearchHistory(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Something went wrong." });
  });
});
