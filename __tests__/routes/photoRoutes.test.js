const http = require("http");
const request = require("supertest");
const { app } = require("../../index");
const axios = require("axios");
const { sequelize, user, photo, tag } = require("../../models");

jest.mock("axios");

let server;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(3000, done);
});

afterAll(async () => {
  // Gracefully close the HTTP server after tests to free up the port and avoid Jest open handle warnings
  await new Promise((resolve) => server.close(resolve));
  await sequelize.close(); // Close the sequelize connection with supabase
});

describe("GET api/photos/search", () => {
  beforeEach(() => {
    process.env.UNSPLASH_ACCESS_KEY = "test_key"; // Fake key to pass the check
  });

  it("should return 200 and list of photos", async () => {
    axios.get.mockResolvedValue({
      data: {
        results: [
          {
            urls: { regular: "https://images.unsplash.com/" },
            description: "Beautiful",
            alt_description: "Nature scene",
          },
        ],
      },
    });

    const res = await request(server).get("/api/photos/search?query=nature");
    expect(res.statusCode).toBe(200);
    expect(res.body.photos).toBeDefined();
    expect(res.body.photos.length).toBeGreaterThan(0);
  });

  it("should return 400 if query is missing", async () => {
    const res = await request(server).get("/api/photos/search");
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Search term (query) is required");
  });

  it("should return 404 if no photos found", async () => {
    axios.get.mockResolvedValue({ data: { results: [] } });

    const res = await request(server).get("/api/photos/search?query=unknown");
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("No images found for the given query.");
  });
});

describe("POST api/photos", () => {
  let testUser;

  beforeEach(async () => {
    await photo.destroy({ where: {} });
    await tag.destroy({ where: {} });
    await user.destroy({ where: {} });

    testUser = await user.create({
      username: "testuser",
      email: "testphoto@example.com",
    });

    jest.clearAllMocks();
  });

  it("should save photo successfully", async () => {
    const res = await request(server)
      .post("/api/photos")
      .send({
        imageUrl: "https://images.unsplash.com/photo-123",
        description: "Beautiful landscape",
        altDescription: "Mountain view",
        tags: ["nature", "mountain"],
        userId: testUser.id,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toEqual("Photo saved successfully");
  });

  it("should return 400 if userId is missing or invalid", async () => {
    const res = await request(server)
      .post("/api/photos")
      .send({
        imageUrl: "https://images.unsplash.com/photo-123",
        description: "Beautiful landscape",
        altDescription: "Mountain view",
        tags: ["nature", "mountain"],
        userId: "not-a-number",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual("Valid userId is required");
  });

  it("should return 404 if user not found", async () => {
    const res = await request(server)
      .post("/api/photos")
      .send({
        imageUrl: "https://images.unsplash.com/photo-123",
        description: "Beautiful landscape",
        altDescription: "Mountain view",
        tags: ["nature", "mountain"],
        userId: 9999, // non-existent
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toEqual("User not found");
  });

  it("should return 400 for invalid image URL", async () => {
    const res = await request(server)
      .post("/api/photos")
      .send({
        imageUrl: "http://invalid-url.com",
        description: "Beautiful landscape",
        altDescription: "Mountain view",
        tags: ["nature", "mountain"],
        userId: testUser.id,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual("Invalid image URL");
  });

  it("should return 400 for invalid tags array", async () => {
    const res = await request(server).post("/api/photos").send({
      imageUrl: "https://images.unsplash.com/photo-123",
      description: "Beautiful landscape",
      altDescription: "Mountain view",
      tags: "invalid-tags-array",
      userId: testUser.id,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual("Tags must be an array");
  });

  it("should return 400 for too many tags", async () => {
    const tags = ["one", "two", "three", "four", "five", "six"];

    const res = await request(server).post("/api/photos").send({
      imageUrl: "https://images.unsplash.com/photo-123",
      description: "Beautiful landscape",
      altDescription: "Mountain view",
      tags: tags,
      userId: testUser.id,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual("No more than 5 tags allowed");
  });
});

describe("POST /api/photos/:photoId/tags", () => {
  let testUser, testPhoto;

  beforeEach(async () => {
    jest.clearAllMocks();

    await tag.destroy({ where: {} });
    await photo.destroy({ where: {} });
    await user.destroy({ where: {} });

    testUser = await user.create({
      username: "testuser",
      email: "testuser@example.com",
    });

    testPhoto = await photo.create({
      imageUrl: "https://images.unsplash.com/photo-123",
      description: "Beautiful landscape",
      altDescription: "Mountain view",
      userId: testUser.id,
    });
  });

  it("should add valid tags to a photo", async () => {
    const res = await request(server)
      .post(`/api/photos/${testPhoto.id}/tags`)
      .send({
        tags: ["newTag1", "newTag2"],
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Tags added successfully");
  });

  test("should return 400 for invalid tag input (not an array)", async () => {
    const res = await request(server)
      .post(`/api/photos/${testPhoto.id}/tags`)
      .send({ tags: "notAnArray" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Tags must be an array");
  });

  test("should return 400 for empty string tags", async () => {
    const res = await request(server)
      .post(`/api/photos/${testPhoto.id}/tags`)
      .send({ tags: ["", "  "] });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Tags must be non-empty strings");
  });
});

describe("GET /api/photos/tag/search", () => {
  let testUser;

  beforeEach(async () => {
    jest.clearAllMocks();
    await user.destroy({ where: {} });
    await photo.destroy({ where: {} });
    await tag.destroy({ where: {} });

    testUser = await user.create({
      username: "testuser",
      email: "testuser@example.com",
    });

    // Create sample photo and tags
    const samplePhoto = await photo.create({
      imageUrl: "https://www.unsplash.com/sample-photo",
      description: "Beautiful nature",
      altDescription: "A beautiful land on the surface of earth.",
      userId: testUser.id,
    });

    await tag.bulkCreate([
      { name: "nature", photoId: samplePhoto.id },
      { name: "mountain", photoId: samplePhoto.id },
    ]);
  });

  it("should return 200 and photos for a valid tag", async () => {
    const res = await request(server).get(
      `/api/photos/tag/search?tags=mountain&sort=ASC&userId=${testUser.id}`
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.photos).toBeDefined();
    expect(res.body.photos[0].tags).toContain("nature");
  });

  it("should return 404 if no photos for the tag", async () => {
    const res = await request(app).get(
      "/api/photos/tag/search?tags=nonexistent&sort=ASC"
    );

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("No images found for the given tag.");
  });

  it("should return 400 for missing tag", async () => {
    const res = await request(app).get("/api/photos/tag/search");

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe(
      "Tag is required and must be a non-empty string."
    );
  });

  it("should return 400 for invalid sort value", async () => {
    const res = await request(app).get(
      "/api/photos/tag/search?tags=nature&sort=INVALID"
    );

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Sort must be either ASC or DESC.");
  });
});
