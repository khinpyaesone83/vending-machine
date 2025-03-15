const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const fs = require("fs");
const csvParser = require("csv-parser");

const app = express();
const CSV_FILE_PATH = "challenge.csv";

// GraphQL Schema
const schema = buildSchema(`
  type Challenge {
    id: ID
    name: String
    difficulty: String
  }

  type Query {
    getChallenges: [Challenge]
    downloadCSV: String
  }
`);

// Function to read CSV and convert to JSON
const getChallenges = () => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(CSV_FILE_PATH)
      .pipe(csvParser())
      .on("data", (data) => {
        results.push({
          id: data.id ? data.id.trim() : null,
          name: data.name ? data.name.trim() : null,
          difficulty: data.difficulty ? data.difficulty.trim() : null,
        });
      })
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
};

// GraphQL Resolvers
const root = {
  getChallenges: () => getChallenges(),
  downloadCSV: () => `http://localhost:8080/download`,
};

// Route to download CSV
app.get("/download", (req, res) => {
  res.download(CSV_FILE_PATH);
});

// GraphQL Middleware
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

// Start Server
app.listen(8080, () => {
  console.log("Server running at http://localhost:8080");
});
