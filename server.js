const express = require('express');
const path = require('path');
const app  = express();
const port = process.env.PORT || 5000;
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//const data = fs.readFileSync('./database.json');
//const conf = JSON.parse(data);
const conf = {
  host: process.env.MARIA_HOST,
  user: process.env.MARIA_USER,
  password: process.env.MARIA_PASSWORD,
  port: process.env.MARIA_PORT,
  database: process.env.MARIA_DATABASE
}
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: conf.host,
  user: conf.user,
  password: conf.password,
  port: conf.port,
  database: conf.database
});
connection.connect();

app.get('/api/hello', (req, res) => {
    res.send({message: "Hello Express"});
});



app.get("/api/customers", (req, res) => {
    //res.send(customers);
    connection.query(
      "select * from customer",
      (err, rows, fields) => {
        res.send(rows);
      }
    )
});

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.listen(port, () => {console.log(`Listening on ${port}`)});