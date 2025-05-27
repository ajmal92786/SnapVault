const {
  isEmailValid,
  isUsernameValid,
} = require("../../src/validations/userValidations");

describe("User Validation Functions", () => {
  test("Valid email should return true", () => {
    expect(isEmailValid("test@example.com")).toBe(true);
  });

  test("Invalid email should return false", () => {
    expect(isEmailValid("testexample.com")).toBe(false);
  });

  test("Valid username should return true", () => {
    expect(isUsernameValid("john_doe")).toBe(true);
  });

  test("Empty username should return false", () => {
    expect(isUsernameValid("")).toBe(false);
  });
});
