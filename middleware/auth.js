const jwt = require("jsonwebtoken");

const verifyAccesstoken = async (req, res, next) => {
  const apiUrl = req.originalUrl;
  const apiMethod = req.method;

  const token = req.headers["authorization"].split(" ")[1];
  console.log(token);

  await jwt.verify(token, process.env.TOKEN_KEY, (err, decodedToken) => {
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
  if (apiMethod == "GET") {
    return true;
  }
  if (decodedToken.role == "admin") {
    return true;
  }
  if (decodedToken.role == "manager" && apiMethod == "PUT") {
    return true;
  }
  if (
    decodedToken.role == "cashier" &&
    apiMethod == "PUT" &&
    !apiUrl.includes("soft-delete")
  ) {
    return true;
  }

  return false;
}
module.exports = verifyAccesstoken;
