/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: ["en", "id"],
  catalogs: [
    {
      path: "<rootDir>/app/locales/{locale}/messages",
      include: ["app"],
    },
  ],
  format: "po",
};
