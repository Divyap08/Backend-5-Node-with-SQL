const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));


const connection = mysql.createConnection({
    host : "localhost",
    user: "root",
    database: "delta_app",
    password: "mysql8"
});

//here we r returning array using faker   //This getRandomUser is function
let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

// Inserting new data
let q = "INSERT INTO user (id, username, email, password) VALUES ?";

let data = [];
for(let i=0; i<=110; i++) {
  data.push(getRandomUser());   //100 fake data
}




app.get("/", (req, res) => {
  let q = `SELECT count(*) FROM user`;

  try {  
   connection.query(q, (err, result) => {
    if (err) throw err;
    let count = (result[0]["count(*)"]);
    res.render("home.ejs", { count });
   });
  } catch (err) {
   console.log("Some err in DB");
   res.send("Error");
  }
});

//start server
app.listen("8080", () => {
  console.log("server is listening on port 8080");
});




// connection.end();


