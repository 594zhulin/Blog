const express = require("express");
const { check } = require("express-validator");
const validator = require("../config/validator");
const connection = require("../config/db");
const router = express.Router();

/**
 * @typedef ArticleId
 * @property {string} id.required - id
 */

/**
 * @typedef Article
 * @property {string} title.required - 标题
 * @property {string} categoryId.required - 分类id
 * @property {string} tagId.required - 标签id
 * @property {string} content.required - 内容
 * @property {string} thumbnail.required - 缩略图
 */

/**
 * @typedef Response
 * @property {number} code
 * @property {string} message
 * @property {array<object>} data
 */

/**
 * @route GET /article/get
 * @group 文章
 * @returns {Response.model} 200 - 	successful operation
 */
router.get("/get", async (req, res) => {
  try {
    const sql = "SELECT * FROM article";
    const result = await connection(sql);
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

/**
 * @route POST /article/add
 * @group 文章
 * @param {Article.model} body.body.required
 * @returns {Response.model} 200 - 	successful operation
 */
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

/**
 * @route PUT /article/update
 * @group 文章
 * @param {Article.model} body.body.required
 * @param {ArticleId.model} body.body.required
 * @returns {Response.model} 200 - 	successful operation
 */
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

/**
 * @route DELETE /article/delete
 * @group 文章
 * @param {ArticleId.model} body.body.required
 * @returns {Response.model} 200 - 	successful operation
 */
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
