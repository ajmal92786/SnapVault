const { validateNewTags } = require("../../src/validations/tagValidations");

describe("validateNewTags", () => {
  test("should return valid for proper tags", () => {
    const result = validateNewTags(["nature", "sky"]);
    expect(result.valid).toBe(true);
  });

  test("should return false if tags is not an array", () => {
    const result = validateNewTags("notAnArray");
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Tags must be an array");
  });

  test("should return false if tags contain empty strings", () => {
    const result = validateNewTags(["", "  "]);
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Tags must be non-empty strings");
  });
});
