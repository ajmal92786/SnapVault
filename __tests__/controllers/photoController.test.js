const { searchPhotos } = require("../../src/controllers/photoController");
const { searchImages } = require("../../src/services/photoService");

jest.mock("../../src/services/photoService", () => ({
  searchImages: jest.fn(),
}));

describe("Photo Controller - searchPhotos", () => {
  let req, res;

  beforeEach(() => {
    req = { query: { query: "nature" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return 200 and photos if result is successful", async () => {
    const mockPhotos = [
      {
        urls: { regular: "https://images.unsplash.com/" },
        description: "Beautiful",
        alt_description: "Nature scene",
      },
    ];
    searchImages.mockResolvedValue({ photos: mockPhotos });

    await searchPhotos(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ photos: mockPhotos });
  });

  it("should return 404 if no photos are found", async () => {
    const mockResponse = { message: "No images found for the given query." };
    searchImages.mockResolvedValue(mockResponse);

    await searchPhotos(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(mockResponse);
  });

  it("should return 400 if query is missing", async () => {
    req.query.query = "";

    await searchPhotos(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Search term (query) is required",
    });
  });

  it("should return 500 on internal server error", async () => {
    // Mocking searchImages to simulate Unsplash API failure scenario
    searchImages.mockImplementation(() => {
      throw new Error("API failed");
    });

    await searchPhotos(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "API failed" });
  });
});
