const http = require("http");
const request = require("supertest");
const { app } = require("../../index");
const { sequelize, user, searchHistory } = require("../../models");

let server;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(3002, done);
});

afterAll(async () => {
  await new Promise((resolve) => server.close(resolve)); // close HTTP servers
  await sequelize.close(); // close DB connection
});

describe("GET api/search-history", () => {
  let testUser;

  beforeEach(async () => {
    jest.clearAllMocks();

    await user.destroy({ where: {} });
    await searchHistory.destroy({ where: {} });

    testUser = await user.create({
      username: "testuser",
      email: "test@example.com",
    });

    await searchHistory.bulkCreate([
      { userId: testUser.id, query: "mountains" },
      { userId: testUser.id, query: "beaches" },
    ]);
  });

  afterEach(async () => {
    await searchHistory.destroy({ where: {} });
    await user.destroy({ where: {} });
  });

  it("should return 200 and search history for valid userId", async () => {
    const res = await request(app).get(
      `/api/search-history?userId=${testUser.id}`
    );

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("searchHistory");
    expect(Array.isArray(res.body.searchHistory)).toBe(true);
    expect(res.body.searchHistory.length).toBeGreaterThan(0);
  });

  it("should return 400 for missing userId", async () => {
    const res = await request(app).get("/api/search-history");

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid or missing userId");
  });

  it("should return 404 if no history found", async () => {
    const res = await request(app).get("/api/search-history?userId=9999");

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/No history found/);
  });
});
