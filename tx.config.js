module.exports = {
  // Dein Transifex-Projekt (Org/Slug anpassen!)
  project: "mentalhealthgpt/frontend",
  token: process.env.TRANSIFEX_API_TOKEN,
  filters: [
    {
      // wir extrahieren Texte aus allen TSX-Dateien im templates-Ordner
      test: ["templates/**/*.tsx", "app/**/*.tsx"],
      extractors: [
        {
          type: "jsx",
        },
      ],
    },
  ],
};
