const express = require('express');
const connection = require('../config/db');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const sql = 'SELECT * FROM user';
        const result = await connection(sql);
        res.json(result);
    } catch (error) {
        console.log(error);
    }
})

router.put('/update', async (req, res) => {
    try {
        const { id, avatar, username, birthday, sex } = req.body;
        const sql = 'UPDATE user SET avatar=?,username=?,birthday=?,sex=? WHERE id=?';
        const result = await connection(sql, [avatar, username, birthday, sex, id]);
        res.json(result);
    } catch (error) {
        console.log(error);
    }
})

router.delete('/delete', async (req, res) => {
    try {
        const { id } = req.body;
        const sql = 'DELETE FROM user WHERE id=?';
        const result = await connection(sql, [id]);
        res.json(result);
    } catch (error) {
        console.log(error);
    }
})


module.exports = router;