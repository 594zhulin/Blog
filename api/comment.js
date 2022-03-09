const express = require("express");
const { check } = require("express-validator");
const validator = require("../config/validator");
const connection = require("../config/db");
const router = express.Router();

/**
 * @typedef CommentAddParams
 * @property {string} userId.required - 用户id
 * @property {string} content.required - 内容
 * @property {string} articleId.required - 文章id
 */

/**
 * @typedef CommentUpdateParams
 * @property {string} id.required - 评论id
 * @property {string} userId.required - 用户id
 * @property {string} content.required - 内容
 * @property {string} articleId.required - 文章id
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
 * @property {string} publishTime - 发布时间
 */

/**
 * @typedef CommentListResponse
 * @property {number} code
 * @property {string} message
 * @property {CommentItem[]} data
 */

/**
 * @route GET /comment/get
 * @param {string} articleId.query.required - 文章id
 * @group 评论
 * @returns {CommentListResponse.model} 200 - 	successful operation
 */
router.get("/get", [
  check("articleId").notEmpty().withMessage("articleId不能为空").isString()], validator(async (req, res) => {
    try {
      const { articleId } = req.query;
      const sql = "SELECT * FROM comment WHERE articleId=?";
      const result = await connection(sql, [articleId]);
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
