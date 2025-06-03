const http = require("http");
const request = require("supertest");
const { app } = require("../../index.js");
const { sequelize, user } = require("../../models/index.js");

let server;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(3000, done);
});

afterAll(async () => {
  await new Promise((resolve) => server.close(resolve));
  await sequelize.close();
});

// Integration testing
describe("POST /api/users", () => {
  // Clean up test DB before each test
  beforeEach(async () => {
    jest.clearAllMocks(); // ensure mocks reset between tests
    await user.destroy({ where: {} }); // Clear the users table
  });

  test("should create a new user successfully", async () => {
    const res = await request(server).post("/api/users").send({
      username: "testuser",
      email: "testuser@example.com",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "User created successfully");
    expect(res.body.user).toHaveProperty("username", "testuser");
    expect(res.body.user).toHaveProperty("email", "testuser@example.com");
  });

  test("should not allow duplicate email", async () => {
    await user.create({ username: "existing", email: "duplicate@example.com" });

    const res = await request(server).post("/api/users").send({
      username: "test",
      email: "duplicate@example.com",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Email already exists.");
  });

  test("should return 400 if email is invalid", async () => {
    const res = await request(server).post("/api/users").send({
      username: "invalidemailuser",
      email: "invalidemail.com",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid email format.");
  });

  test("should return 400 if required fields are missing", async () => {
    const res = await request(app).post("/api/users").send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Username and email are required.");
  });
});
