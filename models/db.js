const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database("data4.db", (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the database.");

    db.run(
      `CREATE TABLE IF NOT EXISTS medicines(recordId INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, quantity INT , soft_deleted INT)`,
      (err) => {
        if (err) {
          throw err;
        } else {
          console.log("medicines table created");
        }
      }
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS user(id INT, name TEXT, username TEXT,password TEXT,role TEXT)`,
      (err) => {
        if (err) {
          throw err;
        } else {
          console.log("user table created");
        }
      }
    );
    db.run(
      `CREATE TABLE IF NOT EXISTS customer(recordId INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, mobilenumber TEXT, medicines_issued TEXT , soft_deleted INT)`,
      (err) => {
        if (err) {
          throw err;
        } else {
          console.log("user table created");
        }
      }
    );
  }
});

module.exports = db;
