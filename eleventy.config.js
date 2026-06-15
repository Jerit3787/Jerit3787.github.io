// Eleventy configuration.
// Content lives in src/_data/*.json, templates in src/. Output is _site/.
module.exports = function (eleventyConfig) {
  // Copy static assets straight through to the built site.
  eleventyConfig.addPassthroughCopy("assets/img");
  eleventyConfig.addPassthroughCopy({ "src/js": "assets/js" });
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("CNAME");

  // Make the current year available to templates (e.g. footer copyright).
  eleventyConfig.addGlobalData("currentYear", () => new Date().getFullYear());

  // Rebuild HTML whenever the compiled stylesheet or scripts change in dev.
  eleventyConfig.addWatchTarget("./src/styles/");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["njk", "html"],
  };
};
