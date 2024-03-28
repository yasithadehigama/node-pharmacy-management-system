//const db = require("../models/db");
const bcrypt = require("bcrypt");
const { raw } = require("express");
const jwt = require("jsonwebtoken");
var sqlite3 = require("sqlite3").verbose();
const db = require("../models/db");

const userRegister = async (req, res) => {
  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  const sql = `SELECT * FROM user WHERE username  = ?`;

  db.get(sql, [username], (err, row) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "User Registration Failed" });
    } else {
      if (row !== undefined) {
        console.log("-");
        res.status(409).json({ message: "User Already Registered" });
      } else {
        db.run(
          "INSERT INTO user(id, name, username,password,role) VALUES(?,?,?,?,?)",
          [1, name, username, hashedPassword, role]
        );

        res.status(200).json({ message: "Registration Sucessful" });
      }
    }
  });
};

const userLogin = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const sql = `SELECT * FROM user WHERE username = ?`;

  db.get(sql, [username], async (err, row) => {
    if (err) {
      res.status(500).json({ message: "User Login Failed" });
      return err;
    } else {
      const passwordMatch = await bcrypt.compare(password, row.password);

      if (!passwordMatch) {
        res.status(500).json({ message: "Password is not match" });
      }

      const token = jwt.sign(
        { userId: row.username, role: row.role },
        process.env.TOKEN_KEY,
        {
          expiresIn: "1h",
        }
      );
      res.status(200).json({ token });
    }
  });
};

module.exports = {
  userRegister,
  userLogin,
};
