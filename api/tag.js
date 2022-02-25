const express = require('express');
const connection = require('../config/db');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const sql = 'SELECT * FROM tag';
        const result = await connection(sql);
        res.json(result);
    } catch (error) {
        console.log(error);
    }
})

router.post('/add', async (req, res) => {
    try {
        const { name } = req.body;
        const sql = 'INSERT INTO tag(name) VALUES(?)';
        const result = await connection(sql, name);
        res.json(result);
    } catch (error) {
        console.log(error);
    }
})

router.put('/update', async (req, res) => {
    try {
        const { id, name } = req.body;
        const sql = 'UPDATE tag SET name=? WHERE id=?';
        const result = await connection(sql, [name, id]);
        res.json(result);
    } catch (error) {
        console.log(error);
    }
})

router.delete('/delete', async (req, res) => {
    try {
        const { id } = req.body;
        const sql = 'DELETE FROM tag WHERE id=?';
        const result = await connection(sql, [id]);
        res.json(result);
    } catch (error) {
        console.log(error);
    }
})


module.exports = router;