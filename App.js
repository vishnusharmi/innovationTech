const express = require("express");
// const db = require("./database");
const app = express();

const mySql = require("mysql2");

const Port = 3000;

const pool = mySql.createConnection({
  host: "nodejs-technical-test.cm30rlobuoic.ap-southeast-1.rds.amazonaws.com",
  user: "candidate",
  password: "NoTeDeSt^C10.6?SxwY882}",
  database: "conqtvms_dev",
});

pool.connect((error) => {
  if (error) console.log(error);
  console.log("database connected");
});

// console.log(db);

app.get("/api/getVendorUsers", (req, res) => {
  const { prId, custOrgId } = req.query;
  console.log(req.query, "query");
  console.log(prId, custOrgId, "check");
  if (!prId || !custOrgId) {
    return res.status(400).json({ error: "prId and custOrderId are required" });
  }
  try {
    pool.query(
      `SELECT DISTINCT VendorOrganizationId AS suplierId,
             UserName ,
             Name
             FROM
             PrLineItems 
             JOIN VendorUsers  ON FIND_IN_SET(VendorOrganizationId, suppliers)
             WHERE
             purchaseRequestId = ? AND
             custOrgId = ? AND
             Role = 'Admin'`,
      [prId, custOrgId],
      (error, results) => {
        if (error) {
          console.log(error);
        }
        res.json(results);
      }
    );
    // res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "database query failed" });
  }
});

app.listen(Port, () => {
  console.log("server running on 3306");
});
