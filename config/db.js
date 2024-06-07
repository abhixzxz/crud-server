const mysql = require("mysql");
require("dotenv").config();

let db;
let reconnectAttempts = 0;
const maxReconnectAttempts = 10;

function handleDisconnect() {
  db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectTimeout: 10000,
  });

  db.connect((err) => {
    if (err) {
      console.error("Error connecting to database:", err.stack);
      reconnectAttempts++;
      if (reconnectAttempts <= maxReconnectAttempts) {
        setTimeout(handleDisconnect, Math.min(1000 * reconnectAttempts, 30000));
      } else {
        console.error(
          "Max reconnect attempts reached. Please check the database server."
        );
      }
    } else {
      console.log("Connected to database");
      reconnectAttempts = 0;
    }
  });

  db.on("error", (err) => {
    console.error("Database error:", err);
    if (
      err.code === "PROTOCOL_CONNECTION_LOST" ||
      err.code === "ECONNRESET" ||
      err.code === "EPIPE"
    ) {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

module.exports = { db };
