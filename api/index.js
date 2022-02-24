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
        console.log(error);
    }
})

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const sql = "SELECT username,password FROM user WHERE username=? AND password=?";
        const result = await connection(sql, [username, password], '登录');
        const { code, message, data } = result;
        if (data.length === 0) {
            res.json({ code: -1, message: '用户不存在' });
        } else {
            res.json({ code, message });
        }
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;