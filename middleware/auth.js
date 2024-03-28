const jwt = require("jsonwebtoken");

const verifyAccesstoken = async (req, res, next) => {
  const ROLES = { ADMIN: "Admin", MANAGER: "manager", CASHIER: "cashier" };
  console.log(req.originalUrl + "   " + req.method);
  const apiUrl = req.originalUrl;
  const apiMethod = req.method;

  const token = req.headers["authorization"].split(" ")[1];
  console.log(token);

  await jwt.verify(token, "testKey@123", (err, decodedToken) => {
    if (err) {
      console.log(err);
      return res.sendStatus(403);
    } else {
      console.log(decodedToken.role);
      const isAllowed = checkPermission(decodedToken, apiMethod, apiUrl);
      console.log(isAllowed);
      if (!isAllowed) {
        return res.sendStatus(401);
      } else {
        req.user = decodedToken;
        next();
      }
    }
  });
};

function checkPermission(decodedToken, apiMethod, apiUrl) {
  console.log(apiUrl == "GET");
  if (apiMethod == "GET") {
    console.log("1");
    return true;
  }
  if (decodedToken.role == "admin") {
    console.log("2");
    return true;
  }
  if (decodedToken.role == "manager" && apiMethod == "PUT") {
    console.log("3");
    return true;
  }

  //console.log(a);
  if (
    decodedToken.role == "cashier" &&
    apiMethod == "PUT" &&
    !apiUrl.includes("soft-delete")
  ) {
    console.log("4");
    return true;
  }
  console.log("log");
  return false;
}
module.exports = verifyAccesstoken;
