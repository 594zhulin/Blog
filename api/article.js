const express = require("express");
const { check } = require("express-validator");
const validator = require("../config/validator");
const connection = require("../config/db");
const router = express.Router();

router.get("/get", async (req, res) => {
  try {
    const sql = "SELECT * FROM article";
    const result = await connection(sql);
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

router.post(
  "/add",
  [
    check("title").notEmpty().withMessage("title不能为空").isString(),
    check("categoryId").notEmpty().withMessage("categoryId不能为空").isString(),
    check("tagId").notEmpty().withMessage("tagId不能为空").isString(),
    check("content").notEmpty().withMessage("content不能为空").isString(),
    check("thumbnail").notEmpty().withMessage("thumbnail不能为空").isString(),
  ],
  validator(async (req, res) => {
    try {
      const { title, categoryId, tagId, content, thumbnail } = req.body;
      const sql =
        "INSERT INTO article(title, categoryId, tagId, content, thumbnail) VALUES(?,?,?,?,?)";
      const result = await connection(sql, [
        title,
        categoryId,
        tagId,
        content,
        thumbnail,
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
    check("title").notEmpty().withMessage("title不能为空").isString(),
    check("categoryId").notEmpty().withMessage("categoryId不能为空").isString(),
    check("tagId").notEmpty().withMessage("tagId不能为空").isString(),
    check("content").notEmpty().withMessage("content不能为空").isString(),
    check("thumbnail").notEmpty().withMessage("thumbnail不能为空").isString(),
  ],
  validator(async (req, res) => {
    try {
      const { id, title, categoryId, tagId, content, thumbnail } = req.body;
      const sql =
        "UPDATE article SET title=?,categoryId=?,tagId=?,content=?,thumbnail=? WHERE id=?";
      const result = await connection(sql, [
        title,
        categoryId,
        tagId,
        content,
        thumbnail,
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
      const sql = "DELETE FROM article WHERE id=?";
      const result = await connection(sql, [id]);
      res.json(result);
    } catch (error) {
      console.log(error);
    }
  })
);

module.exports = router;
