const {
  validateImageUrl,
  validateTags,
} = require("../../src/validations/photoValidations");

describe("Photo Validation Functions", () => {
  it("should return true for valid Unsplash URL", () => {
    expect(validateImageUrl("https://images.unsplash.com/photo-xyz")).toBe(
      true
    );
  });

  it("should return false for invalid image URL", () => {
    expect(validateImageUrl("https://invalid.com/photo.jpg")).toBe(false);
  });

  it("should validate correct tags array", () => {
    const result = validateTags(["tag1", "tag2"]);
    expect(result.valid).toBe(true);
  });

  it("should fail if tags not an array", () => {
    const result = validateTags("tag");
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Tags must be an array");
  });

  it("should fail if more than 5 tags", () => {
    const result = validateTags(["1", "2", "3", "4", "5", "6"]);
    expect(result.valid).toBe(false);
    expect(result.message).toBe("No more than 5 tags allowed");
  });

  it("should fail on empty string tag", () => {
    const result = validateTags([" "]);
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Tags must be non-empty string");
  });

  it("should fail on tag over 20 characters", () => {
    const result = validateTags(["a".repeat(21)]);
    expect(result.valid).toBe(false);

    expect(result.message).toMatch(/exceeds 20 characters/); // Check that the message contains the substring "exceeds 20 characters"
  });
});
