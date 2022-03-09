const express = require("express");
const { check } = require("express-validator");
const validator = require("../config/validator");
const connection = require("../config/db");
const router = express.Router();

/**
 * @typedef CategoryAddParams
 * @property {string} parentId.required - 父级分类id
 * @property {string} name.required - 分类名称
 */

/**
 * @typedef CategoryUpdateParams
 * @property {string} id.required - 分类id
 * @property {string} name.required - 分类名称
 * @property {string} parentId.required - 父级分类id
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
 * @property {string} parentId - 父级分类id
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
    const sql = "SELECT * FROM category";
    const result = await connection(sql);
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

/**
 * @route POST /category/add
 * @group 分类
 * @param {CategoryAddParams.model} body.body.required
 * @returns {CommonResponse.model} 200 - 	successful operation
 */
router.post(
  "/add",
  [check("name").notEmpty().withMessage("name不能为空").isString()],
  validator(async (req, res) => {
    try {
      const { name } = req.body;
      const sql = "INSERT INTO category(name) VALUES(?)";
      const result = await connection(sql, name);
      res.json(result);
    } catch (error) {
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
