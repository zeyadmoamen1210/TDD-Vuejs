module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  moduleNameMapper: {
    axios: "axios/dist/node/axios.cjs",
  },
  moduleFileExtensions: ["js", "vue", "json"],
  testMatch: ["**/*.spec.js"],
  setupFilesAfterEnv: ["./test/setupTest.js"],
};
