const {
  searchPhotos,
  savePhoto,
} = require("../../src/controllers/photoController");
const {
  searchImages,
  savePhotoWithTags,
} = require("../../src/services/photoService");
const { doesUserExistsById } = require("../../src/services/userService");
const {
  validateImageUrl,
  validateTags,
} = require("../../src/validations/photoValidations");

jest.mock("../../src/services/photoService", () => ({
  searchImages: jest.fn(),
  savePhotoWithTags: jest.fn(),
}));

jest.mock("../../src/services/userService");
jest.mock("../../src/validations/photoValidations");

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

describe("Photo Controller - savePhoto", () => {
  let req, res;

  beforeEach(async () => {
    req = {
      body: {
        imageUrl: "https://images.unsplash.com/photo-123",
        description: "Beautiful landscape",
        altDescription: "Mountain view",
        tags: ["nature", "mountain"],
        userId: 1,
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should save photo and return 201", async () => {
    const mockResponse = {
      id: 1,
      imageUrl: "https://images.unsplash.com/photo-123",
      description: "Beautiful landscape",
      altDescription: "Mountain view",
      tags: ["nature", "mountain"],
      userId: 1,
    };

    doesUserExistsById.mockResolvedValue(true);
    validateImageUrl.mockReturnValue(true);
    validateTags.mockReturnValue({ valid: true });
    savePhotoWithTags.mockResolvedValue(mockResponse);

    await savePhoto(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Photo saved successfully",
    });
  });

  it("should return 400 if userId is invalid", async () => {
    req.body.userId = null;

    await savePhoto(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Valid userId is required",
    });
  });

  it("should return 404 if user does not exist", async () => {
    doesUserExistsById.mockResolvedValue(false);

    await savePhoto(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should return 400 for invalid image URL", async () => {
    doesUserExistsById.mockResolvedValue(true);
    validateImageUrl.mockReturnValue(false);

    await savePhoto(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid image URL" });
  });

  it("should return 400 if tag validation fails", async () => {
    doesUserExistsById.mockResolvedValue(true);
    validateImageUrl.mockReturnValue(true);
    validateTags.mockReturnValue({ valid: false, message: "Invalid tags" });

    await savePhoto(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid tags" });
  });
});
