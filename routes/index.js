let express = require('express');
let mysql = require('mysql');
let uuid = require('node-uuid');
let router = express.Router();
let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'blog'
})

connection.connect();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.post('/register', function (req, res, next) {
  let uid = uuid.v1().replace(/\-/g,'');
  let account = req.body.account;
  let password = req.body.password;
  let nickName = req.body.nickName;
  let sql = "insert into user(id,account,password,nickName) values('"+uid+"','"+account+"','"+password+"','"+nickName+"')";
  connection.query(sql, (err, rows) => {
    if (err) {
      res.status(400).json({code:err.c})
      return
    }
    res.send(rows);
  })
});



module.exports = router;
