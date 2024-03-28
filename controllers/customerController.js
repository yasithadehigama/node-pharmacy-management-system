const db = require("../models/db");

const getCustomer = async (req, res, next) => {
  const mobilenumber = req.query.mobilenumber;

  try {
    const sql = `SELECT * FROM customer WHERE soft_deleted=?`;
    db.all(sql, [0], (err, row) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "INTERNAL SERVER ERROR" });
      }
      console.log(row);
      res.status(200).json(row);
    });
  } catch (error) {
    console.log(error);
  }
};

const addCustomer = async (req, res) => {
  try {
    dbConnection.run(
      "INSERT INTO customer(name, mobilenumber,medicines_issued,soft_deleted) VALUES(?,?,?,?)",
      [req.body.name, req.body.mobilenumber, req.body.medicines_issued, 0]
    );
    res.status(201).json({ message: "Customer Record Added Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const params = generateUpdateQuery(req);
    const payload = generatePayload(req);
    const sql = `UPDATE customer SET ${params} WHERE recordId=?`;
    payload.push(req.body.recordId);

    db.run(sql, payload, (err) => {
      if (err) {
        console.log(err);

        res.status(500).json({ message: "INTERNAL SERVER ERROR" });
      } else {
        res
          .status(200)
          .json({ message: "Customer Record Updated Successfully" });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const sql = "DELETE FROM customer WHERE recordId=?";
    db.run(sql, [req.query.recordId], (err) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "INTERNAL SERVER ERROR" });
      } else {
        res
          .status(200)
          .json({ message: "Customer Record Deleted Successfully" });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

const softDeleteCustomer = async (req, res) => {
  try {
    const sql = `UPDATE customer SET soft_deleted=? WHERE recordId=?`;

    dbConnection.run(sql, [1, req.query.recordId], (err) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "INTERNAL SERVER ERROR" });
      } else {
        res.status(200).json({ message: "Customer SoftDeleted" });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

function generateUpdateQuery(request) {
  const keys = Object.keys(request.body);
  let query = "";
  for (var i = 0; i < keys.length; i++) {
    if (keys[i] != "recordId") {
      query = query.concat(keys[i] + "=?,");
    }
  }
  return query.slice(0, -1);
}

function generatePayload(request) {
  const keys = Object.keys(request.body);
  let payload = [];
  for (var i = 0; i < keys.length; i++) {
    if (keys[i] != "recordId") {
      payload.push(request.body[keys[i]]);
    }
  }
  return payload;
}

module.exports = {
  getCustomer,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  softDeleteCustomer,
};
