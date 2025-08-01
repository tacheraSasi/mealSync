const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "root",
  database: "lunchDB",
});

async function dbConnect() {
  client.connect((err) => {
    if (err) {
      console.error("Error connecting to database:", err);
      return;
    }
    console.log("Connected to postgresSQL database");
  });
}

module.exports = { dbConnect, client };
