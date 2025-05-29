const { photo, tag, user } = require("../../models");
const { savePhotoWithTags } = require("../../src/services/photoService");
const { doesUserExistsById } = require("../../src/services/userService");

jest.mock("../../models");

describe("Photo Service - savePhotoWithTags", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return true if user exists", async () => {
    user.findByPk.mockResolvedValue({ id: 1 });
    const exists = await doesUserExistsById(1);
    expect(exists).toBe(true);
  });

  it("should return false if user doesn't exist", async () => {
    user.findByPk.mockResolvedValue(null);
    const exists = await doesUserExistsById(99);
    expect(exists).toBe(false);
  });

  it("should create a photo and tags", async () => {
    const fakePhoto = {
      id: 10,
      imageUrl: "https://images.unsplash.com/photo-123",
      description: "test",
      altDescription: "desc",
      userId: 1,
    };
    photo.create.mockResolvedValue(fakePhoto);
    tag.bulkCreate.mockResolvedValue(true);

    const result = await savePhotoWithTags({
      imageUrl: "https://images.unsplash.com/photo-123",
      description: "test",
      altDescription: "desc",
      tags: ["a", "b"],
      userId: 1,
    });

    expect(photo.create).toHaveBeenCalled();
    expect(tag.bulkCreate).toHaveBeenCalled();
    expect(result).toEqual(fakePhoto);
  });

  it("should create a photo without tags", async () => {
    const fakePhoto = {
      id: 11,
      imageUrl: "https://images.unsplash.com/photo-123",
      description: "test",
      altDescription: "desc",
      userId: 1,
    };
    photo.create.mockResolvedValue(fakePhoto);

    const result = await savePhotoWithTags({
      imageUrl: "https://images.unsplash.com/photo-123",
      description: "test",
      altDescription: "desc",
      tags: [],
      userId: 1,
    });

    expect(photo.create).toHaveBeenCalled();
    expect(tag.bulkCreate).not.toHaveBeenCalled();
    expect(result).toEqual(fakePhoto);
  });
});
