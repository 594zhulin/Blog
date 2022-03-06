const express = require("express");
const { check } = require("express-validator");
const validator = require("../config/validator");
const connection = require("../config/db");
const router = express.Router();

router.get("/get", async (req, res) => {
  try {
    const sql = "SELECT * FROM comment";
    const result = await connection(sql);
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

router.post(
  "/add",
  [
    check("avatar").notEmpty().withMessage("avatar不能为空").isString(),
    check("username").notEmpty().withMessage("username不能为空").isString(),
    check("content").notEmpty().withMessage("content不能为空").isString(),
    check("articleId").notEmpty().withMessage("articleId不能为空").isString(),
  ],
  validator(async (req, res) => {
    try {
      const { avatar, username, content, articleId } = req.body;
      const sql =
        "INSERT INTO comment(avatar, username, content, articleId) VALUES(?,?,?,?)";
      const result = await connection(sql, [
        avatar,
        username,
        content,
        articleId,
      ]);
      res.json(result);
    } catch (error) {
      console.log(error);
    }
  })
);

router.put(
  "/update",
  [
    check("id").notEmpty().withMessage("id不能为空").isString(),
    check("avatar").notEmpty().withMessage("avatar不能为空").isString(),
    check("username").notEmpty().withMessage("username不能为空").isString(),
    check("content").notEmpty().withMessage("content不能为空").isString(),
    check("articleId").notEmpty().withMessage("articleId不能为空").isString(),
  ],
  validator(async (req, res) => {
    try {
      const { id, avatar, username, content, articleId } = req.body;
      const sql =
        "UPDATE comment SET avatar=?,username=?,content=?,articleId=? WHERE id=?";
      const result = await connection(sql, [
        avatar,
        username,
        content,
        articleId,
        id,
      ]);
      res.json(result);
    } catch (error) {
      console.log(error);
    }
  })
);

router.delete(
  "/delete",
  [check("id").notEmpty().withMessage("id不能为空").isString()],
  validator(async (req, res) => {
    try {
      const { id } = req.body;
      const sql = "DELETE FROM comment WHERE id=?";
      const result = await connection(sql, [id]);
      res.json(result);
    } catch (error) {
      console.log(error);
    }
  })
);

module.exports = router;
