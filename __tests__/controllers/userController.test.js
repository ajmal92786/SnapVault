const { createNewUser } = require("../../src/controllers/userController.js");
const {
  doesUserExist,
  createUser,
} = require("../../src/services/userService.js");

jest.mock("../../src/services/userService");

// Unit testing
describe("User Controller - createNewUser", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        username: "testuser",
        email: "test@example.com",
      },
    };

    // Mocked res object with status and json functions for assertions
    res = {
      status: jest.fn().mockReturnThis(), // Allows chaining like res.status().json()
      json: jest.fn(),
    };
  });

  it("should return 400 if email already exists", async () => {
    doesUserExist.mockResolvedValue(true);

    await createNewUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Email already exists.",
    });
  });

  it("should return 201 and create user if email doesn't exist", async () => {
    doesUserExist.mockResolvedValue(false);
    createUser.mockResolvedValue({
      id: 1,
      username: "testuser",
      email: "test@example.com",
    });

    await createNewUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "User created successfully",
      user: {
        id: 1,
        username: "testuser",
        email: "test@example.com",
      },
    });
  });
});
