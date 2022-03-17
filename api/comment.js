const express = require("express");
const { check } = require("express-validator");
const validator = require("../config/validator");
const connection = require("../config/db");
const router = express.Router();

/**
 * @typedef CommentAddParams
 * @property {string} user_id.required - 用户id
 * @property {string} content.required - 内容
 * @property {string} article_id.required - 文章id
 */

/**
 * @typedef CommentUpdateParams
 * @property {string} id.required - 评论id
 * @property {string} user_id.required - 用户id
 * @property {string} content.required - 内容
 * @property {string} article_id.required - 文章id
 */

/**
 * @typedef CommentDeleteParams
 * @property {string} id.required - 评论id
 */

/**
 * @typedef CommonResponse
 * @property {number} code
 * @property {string} message
 */

/**
 * @typedef CommentItem
 * @property {string} id - 评论id
 * @property {string} username - 用户名
 * @property {string} avatar - 头像
 * @property {string} content - 内容
 * @property {string} publish_time - 发布时间
 */

/**
 * @typedef CommentListResponse
 * @property {number} code
 * @property {string} message
 * @property {CommentItem[]} data
 */

/**
 * @route GET /comment/get
 * @param {string} article_id.query.required - 文章id
 * @group 评论
 * @returns {CommentListResponse.model} 200 - 	successful operation
 */
router.get("/get", [
  check("article_id").notEmpty().withMessage("articleId不能为空").isString()], validator(async (req, res) => {
    try {
      const { article_id } = req.query;
      const sql = "SELECT * FROM comment WHERE article_id=?";
      const result = await connection(sql, [article_id]);
      res.json(result);
    } catch (error) {
      console.log(error);
    }
  })
);

/**
 * @route POST /comment/add
 * @group 评论
 * @param {CommentAddParams.model} body.body.required
 * @returns {CommonResponse.model} 200 - 	successful operation
 */
router.post(
  "/add",
  [
    check("avatar").notEmpty().withMessage("avatar不能为空").isString(),
    check("username").notEmpty().withMessage("username不能为空").isString(),
    check("content").notEmpty().withMessage("content不能为空").isString(),
    check("article_id").notEmpty().withMessage("articleId不能为空").isString(),
  ],
  validator(async (req, res) => {
    try {
      const { avatar, username, content, article_id } = req.body;
      const sql =
        "INSERT INTO comment(avatar, username, content, article_id) VALUES(?,?,?,?)";
      const result = await connection(sql, [
        avatar,
        username,
        content,
        article_id,
      ]);
      res.json(result);
    } catch (error) {
      console.log(error);
    }
  })
);

/**
 * @route PUT /comment/update
 * @group 评论
 * @param {CommentUpdateParams.model} body.body.required
 * @returns {CommonResponse.model} 200 - 	successful operation
 */
router.put(
  "/update",
  [
    check("id").notEmpty().withMessage("id不能为空").isString(),
    check("avatar").notEmpty().withMessage("avatar不能为空").isString(),
    check("username").notEmpty().withMessage("username不能为空").isString(),
    check("content").notEmpty().withMessage("content不能为空").isString(),
    check("article_id").notEmpty().withMessage("articleId不能为空").isString(),
  ],
  validator(async (req, res) => {
    try {
      const { id, avatar, username, content, article_id } = req.body;
      const sql =
        "UPDATE comment SET avatar=?,username=?,content=?,article_id=? WHERE id=?";
      const result = await connection(sql, [
        avatar,
        username,
        content,
        article_id,
        id,
      ]);
      res.json(result);
    } catch (error) {
      console.log(error);
    }
  })
);

/**
 * @route DELETE /comment/delete
 * @group 评论
 * @param {CommentDeleteParams.model} body.body.required
 * @returns {CommonResponse.model} 200 - 	successful operation
 */
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
