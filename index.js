const { faker } = require('@faker-js/faker');

const mysql = require('mysql2');

const connection = mysql.createConnection({
    host : "localhost",
    user: "root",
    database: "delta_app",
    password: "mysql8"
});

//here we r returning array using faker
let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password(),
  ];
}

//Inserting new data
let q = "INSERT INTO user (id, username, email, password) VALUES ?";

let data = [];
for(let i=0; i<=100; i++) {
  data.push(getRandomUser());   //100 fake data
}

try {  
   connection.query(q, [data], (err, result) => {
    if (err) throw err;
    console.log(result);
   });
} catch (err) {
    console.log(err);
}
 connection.end();



