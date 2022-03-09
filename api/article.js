const express = require("express");
const { check } = require("express-validator");
const validator = require("../config/validator");
const connection = require("../config/db");
const router = express.Router();

/**
 * @typedef ArticleDeleteParams
 * @property {string} id.required - 文章id
 */

/**
 * @typedef ArticleAddParams
 * @property {string} title.required - 标题
 * @property {string} categoryId.required - 分类id
 * @property {TagItem[]} tags.required - 标签
 * @property {string} content.required - 内容
 * @property {string} thumbnail.required - 缩略图
 */

/**
 * @typedef ArticleUpdateParams
 * @property {string} id.required - 文章id
 * @property {string} title.required - 标题
 * @property {string} categoryId.required - 分类id
 * @property {TagItem[]} tags.required - 标签
 * @property {string} content.required - 内容
 * @property {string} thumbnail.required - 缩略图
 */

/**
 * @typedef CommonResponse
 * @property {number} code
 * @property {string} message
 */

/**
 * @typedef TagItem
 * @property {string} id - 标签id
 * @property {string} name - 标签名称
 */

/**
 * @typedef ArticleItem
 * @property {string} id - 文章id
 * @property {string} title - 标题
 * @property {string} category - 分类名称
 * @property {string} categoryId - 分类id
 * @property {TagItem[]} tags - 标签名称
 * @property {string} content - 内容
 * @property {string} summary - 简介
 * @property {string} author - 作者
 * @property {string} thumbnail - 缩略图
 * @property {string} publishTime - 发布时间
 * @property {string} updateTime - 更新时间
 * @property {number} hits - 点击量
 * @property {number} views - 阅读量
 * @property {number} shares - 转发量
 * @property {number} comments - 评论量
 * @property {number} likes - 收藏量
 * @property {number} supports - 点赞量
 * @property {number} opposes - 狂踩量
 * @property {number} hot - 是否热门：1-是  0-否
 */

/**
 * @typedef ArticleListResponse
 * @property {number} code
 * @property {string} message
 * @property {ArticleItem[]} data
 */

/**
 * @route GET /article/get
 * @group 文章
 * @returns {ArticleListResponse.model} 200 - 	successful operation
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
 * @param {ArticleAddParams.model} body.body.required
 * @returns {CommonResponse.model} 200 - 	successful operation
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
 * @param {ArticleUpdateParams.model} body.body.required
 * @returns {CommonResponse.model} 200 - 	successful operation
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
 * @param {ArticleDeleteParams.model} body.body.required
 * @returns {CommonResponse.model} 200 - 	successful operation
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
