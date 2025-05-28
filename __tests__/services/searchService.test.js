const axios = require("axios");
const { searchImages } = require("../../src/services/photoService");

jest.mock("axios");

describe("searchImages Service", () => {
  it("should return photos from Unsplash API", async () => {
    process.env.UNSPLASH_ACCESS_KEY = "test-key";

    axios.get.mockResolvedValue({
      data: {
        results: [
          {
            urls: { regular: "https://images.unsplash.com/" },
            description: "A nice view",
            alt_description: "Nature scene",
          },
        ],
      },
    });

    const result = await searchImages("nature");

    expect(result.photos[0]).toHaveProperty(
      "imageUrl",
      "https://images.unsplash.com/"
    );
  });

  it("should return message if no photos found", async () => {
    process.env.UNSPLASH_ACCESS_KEY = "test-key";

    axios.get.mockResolvedValue({ data: { results: [] } });

    const result = await searchImages("unknown");

    expect(result.message).toEqual("No images found for the given query.");
  });

  // This test ensures that the searchImages function throws a clear error
  // when the UNSPLASH_ACCESS_KEY environment variable is missing.
  it("should throw error if no API key", async () => {
    delete process.env.UNSPLASH_ACCESS_KEY;

    await expect(searchImages("nature")).rejects.toThrow(
      "Unsplash API key is missing from environment variables"
    );
  });
});
