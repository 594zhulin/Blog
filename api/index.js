const express = require('express');
const connection = require('../config/db');
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const sql = "INSERT INTO user(username,password) values(?,?)";
        const result = await connection(sql, [username, password]);
        res.json(result);
    } catch (error) {
        if (error.errno === 1062) {
            res.json({ code: -1, message: '用户已存在' });
        }
        console.log(error);
    }
})

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const sql = "SELECT username,password FROM user WHERE username=?";
        const result = await connection(sql, username, '登录');
        const { code, message, data } = result;
        if (data.length === 0) {
            res.json({ code: -1, message: '用户不存在' });
        } else {
            res.json({ code, message: data[0].password === password ? message : '密码错误' });
        }
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;