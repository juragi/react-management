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
  database: process.env.MARIA_DATABASE,
  connectionLimit: 5
}
const mariadb = require('mariadb');
const pool = mariadb.createPool(conf);
//const connection = mysql.createConnection({
//  host: conf.host,
//  user: conf.user,
//  password: conf.password,
//  port: conf.port,
//  database: conf.database
//});
//connection.connect();

async function getConnection(){
  var conn  = await pool.getConnection();
  return conn;
}

app.get('/api/hello', (req, res) => {
    res.send({message: "Hello Express"});
});

const multer = require('multer');
const upload = multer({dest: './upload'});

app.get("/api/customers", (req, res) => {
    //res.send(customers);
    let conn;
    let rows;
    pool.getConnection()
      .then(conn => {
        conn.query("select * from customer where isDeleted = 0 order by id desc")
          .then(rows=>{
            res.send(rows);
          })
          .finally(()=>{
            if(conn) conn.release();
          });
      })
      .catch(err=>{
        console.log(err);
      })
    
    //connection.query(
    //  "select * from customer",
    //  (err, rows, fields) => {
    //    res.send(rows);
    //  }
    //)
});

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.use('/image', express.static('./upload'));

app.post('/api/customers', upload.single('image'), (req, res) => {
  let sql = `insert into customer (image, name, birthday, gender, job, createdDate, isDeleted)
                 values (?, ?, ?, ?, ?, now(), 0)`;
  let image = '/image/' + req.file.filename;
  let name = req.body.name;
  let birthday = req.body.birthday;
  let gender = req.body.gender;
  let job = req.body.job;
  let params = [image, name, birthday, gender, job];
  pool.getConnection()
    .then(conn=>{
      conn.query(sql, params)
        .then(response=>{
          console.log(response);
          res.send(response);
        })
        .finally(() => {
          if(conn) conn.release();
        })
    })
    .catch(err=>{
      console.log(err);
    })
});

app.delete('/api/customers/:id', (req, res) =>{
  let sql = "update customer set isDeleted = 1 where id = ?";
  let params = [req.params.id];
  pool.getConnection()
    .then(conn=> {
      conn.query(sql, params)
        .then(response=>{
          console.log(response);
          res.send(response);
        })
        .finally(()=>{
          if(conn) conn.release();
        });
    })
    .catch(err=>{
      console.log(err);
    })
})

app.listen(port, () => {console.log(`Listening on ${port}`)});