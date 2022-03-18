const express = require("express");
const { check } = require("express-validator");
const validator = require("../config/validator");
const connection = require("../config/db");
const formatTreeData = require("../utils/util");
const router = express.Router();

/**
 * @typedef CategoryAddParams
 * @property {string} parent_id - 父级分类id
 * @property {string} name.required - 分类名称
 */

/**
 * @typedef CategoryUpdateParams
 * @property {string} id.required - 分类id
 * @property {string} name.required - 分类名称
 * @property {string} parent_id.required - 父级分类id
 */

/**
 * @typedef CategoryDeleteParams
 * @property {string} id.required - 分类id
 */

/**
 * @typedef CommonResponse
 * @property {number} code
 * @property {string} message
 */

/**
 * @typedef CategoryItem
 * @property {string} id - 分类id
 * @property {string} name - 分类名称
 * @property {string} parent_id - 父级分类id
 * @property {string} parentName - 父级分类名称
 */

/**
 * @typedef CategoryListResponse
 * @property {number} code
 * @property {string} message
 * @property {CategoryItem[]} data
 */

/**
 * @route GET /category/get
 * @group 分类
 * @returns {CategoryListResponse.model} 200 - 	successful operation
 */
router.get("/get", async (req, res) => {
  try {
    const sql = "SELECT * FROM category WHERE FIND_IN_SET(id,query_category_child_list(0))";
    const result = await connection(sql);
    const { code, message, data } = result;
    res.json({ code, message, data: formatTreeData(data) });
  } catch (error) {
    console.log(error);
  }
});

/**
 * @route POST /category/add
 * @group 分类
 * @param {CategoryAddParams.model} body.body
 * @returns {CommonResponse.model} 200 - 	successful operation
 */
router.post(
  "/add",
  [
    check("name").notEmpty().withMessage("name不能为空").isString()
  ],
  validator(async (req, res) => {
    try {
      const { name, parent_id = 0 } = req.body;
      const sql = "INSERT INTO category(name,parent_id) VALUES(?,?)";
      const result = await connection(sql, [name, parent_id]);
      res.json(result);
    } catch (error) {
      if (error.errno === 1062) {
        res.json({
          code: -1,
          message: "分类已存在",
        });
      }
      console.log(error);
    }
  })
);

/**
 * @route PUT /category/update
 * @group 分类
 * @param {CategoryUpdateParams.model} body.body.required
 * @returns {CommonResponse.model} 200 - 	successful operation
 */
router.put(
  "/update",
  [
    check("id").notEmpty().withMessage("id不能为空").isString(),
    check("name").notEmpty().withMessage("name不能为空").isString(),
  ],
  validator(async (req, res) => {
    try {
      const { id, name } = req.body;
      const sql = "UPDATE category SET name=? WHERE id=?";
      const result = await connection(sql, [name, id]);
      res.json(result);
    } catch (error) {
      console.log(error);
    }
  })
);

/**
 * @route DELETE /category/delete
 * @group 分类
 * @param {CategoryDeleteParams.model} body.body.required
 * @returns {CommonResponse.model} 200 - 	successful operation
 */
router.delete(
  "/delete",
  [check("id").notEmpty().withMessage("id不能为空").isString()],
  validator(async (req, res) => {
    try {
      const { id } = req.body;
      const sql = "DELETE FROM category WHERE id=?";
      const result = await connection(sql, [id]);
      res.json(result);
    } catch (error) {
      console.log(error);
    }
  })
);

module.exports = router;
