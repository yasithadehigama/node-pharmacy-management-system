const express = require("express");
const dotenv = require("dotenv").config();
const verifyAccesstoken = require("./middleware/auth");
const app = express();

app.use(express.json());

const port = process.env.PORT;

app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/customer", require("./routes/customerRoutes"));
app.use("/api/medicine", require("./routes/medicinesRoutes"));

app.listen(port, () => {
  console.log(`App is listing to port ${port}`);
});
