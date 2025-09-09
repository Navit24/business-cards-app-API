//src/db/db-service.js

const config = require("config");
const ENV = config.get("NODE_ENV");

// Function to connect to the appropriate database based on the environment 
const connectToDB = () => {
  if (ENV === "development") {
    require("./connect-local");
  }
  if (ENV === "production") {
    require("./connect-atlas");
  }
};

module.exports = connectToDB;
