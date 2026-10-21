require("dotenv").config();

const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended:true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));


const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD
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


//Home route
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


//Show Route

app.get("/user", (req, res) => {
   let q = `SELECT * FROM user`;

  try {  
   connection.query(q, (err, result) => {
    if (err) throw err;
    res.render("showusers.ejs", { result });
   });
  } catch (err) {
   console.log("Some err in DB");
   res.send("Error");
  }

});


//Edit route

app.get("/user/:id/edit", (req,res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id='${id}'`;

  try {  
   connection.query(q, (err, result) => {
    if (err) throw err;
    let user = result[0];
    res.render("edit.ejs", { user});
   });
  } catch (err) {
   console.log("Some err in DB");
   res.send("Error");
  }  

});


// Update (DB) Route

app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let {password: formPass, username: newUsername} = req.body;
  let q = `SELECT * FROM user WHERE id='${id}'`;

  try {  
   connection.query(q, (err, result) => {
    if (err) throw err;
    let user = result[0];

    if(formPass != user.password) {
       return res.send("WRONG password");

    } else {
      let q2 = `UPDATE user SET username='${newUsername}' WHERE id='${id}'`;
      connection.query(q2, (err, result) => {
       if (err) throw err;
       res.redirect("/user");
      });
  }
   });
  } catch (err) {
   console.log("Some err in DB");
   res.send("Error");
  }    
});


//Adding new user Route

app.get("/user/add", (req,res) => {
  
  res.render("add.ejs");
});

app.post("/user/add", (req, res) => {
  let { username, email, password } = req.body;
  let id = uuidv4();
  //Query to Insert New User
  let q = `INSERT INTO user (id, username, email, password) VALUES ('${id}','${username}','${email}','${password}') `;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      console.log("added new user");
      res.redirect("/user");
    });
  } catch (err) {
    res.send("some error occurred");
  }
});


//start server
app.listen("8080", () => {
  console.log("server is listening on port 8080");
});







