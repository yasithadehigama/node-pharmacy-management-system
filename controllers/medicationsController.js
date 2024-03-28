const db = require("../models/db");

const getMedicines = async (req, res, next) => {
  try {
    const sql = `SELECT * FROM medicines WHERE soft_deleted  = ?`;
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

const addMedicines = async (req, res) => {
  try {
    db.run(
      "INSERT INTO medicines(name, description,quantity,soft_deleted) VALUES(?,?,?,?)",
      [req.body.name, req.body.description, req.body.quantity, 0]
    );
    res.status(201).json({ message: "Medicine Record Added Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

const updateMedicines = async (req, res) => {
  try {
    const params = generateUpdateQuery(req);
    const payload = generatePayload(req);
    const sql = `UPDATE medicines SET ${params} WHERE recordId=?`;

    payload.push(req.body.recordId);

    db.run(sql, payload, (err) => {
      if (err) {
        console.log(err);

        res.status(500).json({ message: "INTERNAL SERVER ERROR" });
      } else {
        res
          .status(200)
          .json({ message: "Medicine Record Updated Successfully" });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

const deleteMedicines = async (req, res) => {
  try {
    const sql = "DELETE FROM medicines WHERE recordId=?";
    db.run(sql, [req.query.recordId], (err) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "INTERNAL SERVER ERROR" });
      } else {
        res
          .status(200)
          .json({ message: "Medicine Record Deleted Successfully" });
        dbConnection.close();
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

const softDeleteMedicines = async (req, res) => {
  try {
    const sql = `UPDATE medicines SET soft_deleted=? WHERE recordId=?`;

    db.run(sql, [1, req.query.recordId], (err) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "INTERNAL SERVER ERROR" });
      } else {
        res.status(200).json({ message: "Medicine SoftDeleted" });
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
  getMedicines,
  addMedicines,
  updateMedicines,
  deleteMedicines,
  softDeleteMedicines,
};
