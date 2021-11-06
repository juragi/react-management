const express = require('express');
const path = require('path');
const app  = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/api/hello', (req, res) => {
    res.send({message: "Hello Express"});
});

const customers = [
    {
      'id': 1,
      'image':'https://placeimg.com/64/64/1',
      'name': '홍길동',
      'birthday': '961222',
      'gender': '남자',
      'job': '대학생'
    },
    {
      'id':2,
      'image':'https://placeimg.com/64/64/2',
      'name': '홍길동2',
      'birthday': '961224',
      'gender': '남자',
      'job': '대학생'
    },
    {
      'id':3,
      'image':'https://placeimg.com/64/64/3',
      'name': '홍길동3',
      'birthday': '961223',
      'gender': '남자',
      'job': 'none'
    },
    {
        'id': 4,
        'image': 'https://placeimg.com/64/64/4',
        'name': '홍길동4',
        'birthday': '961111',
        'gender': '남자',
        'job': 'none'
    }
  ];

app.get("/api/customers", (req, res) => {
    res.send(customers);
});

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.listen(port, () => {console.log(`Listening on ${port}`)});