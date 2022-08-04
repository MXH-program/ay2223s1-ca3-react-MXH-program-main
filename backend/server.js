//////////////////////////////////////////////////////
// INCLUDES
//////////////////////////////////////////////////////
const express = require("express");
const cors = require("cors");
const { expressjwt: jwt } = require("express-jwt");
//JSON WEB TOKEN 
const jwtToken = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3000;
const pool = require("./db");

//////////////////////////////////////////////////////
// APP.USE()
//////////////////////////////////////////////////////

app.use(express.urlencoded({ extended: false }));

app.use(
  jwt({
    secret: "shhhhhhared-secret",
    algorithms: ["HS256"],
  }).unless({ path: ["/api/login"] })
);

//////////////////////////////////////////////////////
// SETUP DB
//////////////////////////////////////////////////////

const CREATE_TABLE_SQL = `CREATE TABLE users (
        userid SERIAL primary key,
        username VARCHAR not null unique,
        password VARCHAR not null unique
    );
`;

const DROP_TABLE_SQL = `DROP TABLE IF EXISTS users;
`;

//////////////////////////////////////////////////////
// SQL TABLE CREATION
//////////////////////////////////////////////////////

app.post("/api/table", async (req, res, next) => {
  pool
    .query(CREATE_TABLE_SQL)
    .then(() => {
      res.send(`Table created`);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.delete("/api/table", async (req, res, next) => {
  pool
    .query(DROP_TABLE_SQL)
    .then(() => {
      res.send(`Table dropped`);
    })
    .catch((error) => {
      res.send(error);
    });
});

//////////////////////////////////////////////////////
// POST GET METHODS CONNECTED TO DB
//////////////////////////////////////////////////////

app.post("/api/user", async (req, res, next) => {
  try {
    console.log(req.body);
    let username = req.body.username;
    let password = req.body.password;

    const newInsert = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
      [username, password]
    );

    res.json(newInsert);
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/api/login",async(req,res)=>{
  let userName=req.body.userName;

  let password=req.body.password;
  let username=req.body.username;

 if(username.indexOf("insert")>0){
  res.json({
    status: "error",
    data: "Illegal input",
  });
  return;
 }

  const allUsers = await pool.query(
    `SELECT userName,password FROM users where userName='${username}' and password='${password}'`
  );
  console.log(allUsers.rows);

  if (allUsers.rows.length == 0) {
    res.json({
      status: "error",
      data: "Username of password incorrect",
    });
    return;
  }
  let user = allUsers.rows[0];

  const token =
    "Bearer " +
    jwtToken.sign(
      {
        _id: user.userid,
        name: user.username,
      },
      "shhhhhhared-secret",
      {
        expiresIn: 3600 * 24 * 3,
      }
    );
    res.json({
      status: "ok",
      data: { token: token },
    });
});

app.get("/api/user", async (req, res, next) => {
  try {
    console.log(req.query);

    const allMessage = await pool.query("SELECT * FROM users");

    res.json(allMessage.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/api/user/test", async (req, res, next) => {
  try {
    console.log(req.query);

    const allMessage = await pool.query("SELECT * FROM users");

    res.json(allMessage.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.delete("/api/user", async (req, res, next) => {
  try {
    console.log(req.params);
    let userid = req.query.userid;

    const deleteUser = await pool.query(`DELETE FROM users WHERE userid=$1`, [
      userid,
    ]);

    res.json(deleteUser);
  } catch (err) {
    console.error(err.message);
  }
});

//////////////////////////////////////////////////////
// DISPLAY SERVER RUNNING
//////////////////////////////////////////////////////

app.get("/", (req, res) => {
  res.send(`Server running on port ${PORT}`);
});

app.get("/api", async (req, res, next) => {
  console.log(req.query);

  res.json(req.query);
});

app.post("/api", async (req, res, next) => {
  console.log(req.body);

  res.json(req.body);
});

app.listen(PORT, () => {
  console.log(`App listening to port ${PORT}`);
});
