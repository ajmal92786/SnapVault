const http = require("http");
const request = require("supertest");
const { app } = require("../../index");
const axios = require("axios");

jest.mock("axios");

let server;

beforeAll((done) => {
  process.env.UNSPLASH_ACCESS_KEY = "test_key"; // Fake key to pass the check
  server = http.createServer(app);
  server.listen(3000, done);
});

afterAll(async () => {
  // Gracefully close the HTTP server after tests to free up the port and avoid Jest open handle warnings
  await new Promise((resolve) => server.close(resolve));
});

describe("GET api/photos/search", () => {
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
