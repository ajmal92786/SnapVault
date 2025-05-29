const {
  validateTagQuery,
  validateSortQuery,
} = require("../../src/validations/searchValidation");

describe("Photo Tag Search Validation", () => {
  test("validateTagQuery - valid tag", () => {
    expect(validateTagQuery("nature")).toBe(true);
  });

  test("validateTagQuery - invalid tag", () => {
    expect(validateTagQuery("")).toBe(false);
    expect(validateTagQuery(123)).toBe(false);
  });

  test("validateSortQuery - valid sort", () => {
    expect(validateSortQuery("ASC")).toBe(true);
    expect(validateSortQuery("desc")).toBe(true);
  });

  test("validateSortQuery - invalid sort", () => {
    expect(validateSortQuery("fast")).toBe(false);
    expect(validateSortQuery("")).toBe(false);
  });
});
