const express = require('express');
const connection = require('../config/db');
const {
	setToken
} = require('../config/token.js');
const router = express.Router();

router.get('/get', async (req, res) => {
	try {
		const sql = 'SELECT * FROM user';
		const result = await connection(sql);
		res.json(result);
	} catch (error) {
		console.log(error);
	}
})

router.post('/register', async (req, res) => {
	try {
		const {
			username,
			password
		} = req.body;
		const sql = "INSERT INTO user(username,password) values(?,?)";
		const result = await connection(sql, [username, password]);
		res.json(result);
	} catch (error) {
		if (error.errno === 1062) {
			res.json({
				code: -1,
				message: '用户已存在'
			});
		}
		console.log(error);
	}
})

router.post('/login', async (req, res) => {
	try {
		const {
			username,
			password
		} = req.body;
		const sql = "SELECT username,password FROM user WHERE username=?";
		const result = await connection(sql, username, '登录');
		const {
			code,
			message,
			data
		} = result;
		if (data.length === 0) {
			res.json({
				code: -1,
				message: '用户不存在'
			});
			return;
		} else {
			if (data[0].password === password) {
				setToken({
					username: data[0].username,
					userid: data[0].id
				}).then(token => {
					res.json({
						code,
						message,
						token
					});
				})
			} else {
				res.json({
					code,
					message: '密码错误'
				});
			}
		}
	} catch (error) {
		console.log(error);
	}
})

router.put('/update', async (req, res) => {
	try {
		const {
			id,
			avatar,
			username,
			birthday,
			sex
		} = req.body;
		const sql = 'UPDATE user SET avatar=?, username=?, birthday=?, sex=? WHERE id=?';
		const result = await connection(sql, [avatar, username, birthday, sex, id]);
		res.json(result);
	} catch (error) {
		console.log(error);
	}
})

router.delete('/delete', async (req, res) => {
	try {
		const {
			id
		} = req.body;
		const sql = 'DELETE FROM user WHERE id=?';
		const result = await connection(sql, [id]);
		res.json(result);
	} catch (error) {
		console.log(error);
	}
})


module.exports = router;
