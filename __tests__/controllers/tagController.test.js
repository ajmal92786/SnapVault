const { addPhotoTags } = require("../../src/controllers/tagController");
const { addTagsToPhoto } = require("../../src/services/tagService");

jest.mock("../../src/services/tagService", () => ({
  addTagsToPhoto: jest.fn(),
}));

describe("addPhotoTags Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { photoId: 1 },
      body: {
        tags: ["newTag1", "newTag2"],
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return 200 if tags added successfully", async () => {
    addTagsToPhoto.mockResolvedValue(); // Mocking addTagsToPhoto to resolve successfully without returning any value

    await addPhotoTags(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Tags added successfully",
    });
  });

  test("should return 400 if validation fails", async () => {
    req.body.tags = "";

    await addPhotoTags(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Tags must be an array",
    });
  });

  test("should return 400 if service throws error", async () => {
    addTagsToPhoto.mockRejectedValue(new Error("Photo not found"));

    await addPhotoTags(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Photo not found",
    });
  });

  it("should return 500 if a error occure", async () => {
    addTagsToPhoto.mockRejectedValue(new Error("Something went wrong"));

    await addPhotoTags(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
