const { doesUserExist } = require("../../src/services/userService");
const { user } = require("../../models");

// Mocks Sequelize user model to simulate user not found
jest.mock("../../models", () => ({
  user: {
    findOne: jest.fn(),
  },
}));

describe("User Service - doesUserExist", () => {
  it("should return true if user exists", async () => {
    user.findOne.mockResolvedValue({ id: 1, email: "test@example.com" });
    const result = await doesUserExist("test@example.com");
    expect(result).toBe(true);
  });

  it("should return false if user does not exist", async () => {
    user.findOne.mockResolvedValue(null);
    const result = await doesUserExist("notFound@example.com");
    expect(result).toBe(false);
  });
});
