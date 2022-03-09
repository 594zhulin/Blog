const express = require("express");
const { check } = require("express-validator");
const validator = require("../config/validator");
const connection = require("../config/db");
const router = express.Router();

/**
 * @typedef TagAddPrams
 * @property {string} name.required - 名称
 */

/**
 * @typedef TagDeleteParams
 * @property {string} id.required - id
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
 * @typedef TagListResponse
 * @property {number} code
 * @property {string} message
 * @property {TagItem[]} data
 */

/**
 * @route GET /tag/get
 * @group 标签
 * @returns {TagListResponse.model} 200 - 	successful operation
 */
router.get("/get", async (req, res) => {
  try {
    const sql = "SELECT * FROM tag";
    const result = await connection(sql);
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

/**
 * @route POST /tag/add
 * @group 标签
 * @param {TagAddPrams.model} body.body.required
 * @returns {CommonResponse.model} 200 - 	successful operation
 */
router.post(
  "/add",
  [check("name").notEmpty().withMessage("name不能为空").isString()],
  validator(async (req, res) => {
    try {
      const { name } = req.body;
      const sql = "INSERT INTO tag(name) VALUES(?)";
      const result = await connection(sql, name);
      res.json(result);
    } catch (error) {
      console.log(error);
    }
  })
);

/**
 * @route PUT /tag/update
 * @group 标签
 * @param {TagAddPrams.model} body.body.required
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
      const sql = "UPDATE tag SET name=? WHERE id=?";
      const result = await connection(sql, [name, id]);
      res.json(result);
    } catch (error) {
      console.log(error);
    }
  })
);

/**
 * @route DELETE /tag/delete
 * @group 标签
 * @param {TagDeleteParams.model} body.body.required
 * @returns {CommonResponse.model} 200 - 	successful operation
 */
router.delete(
  "/delete",
  [check("id").notEmpty().withMessage("id不能为空").isString()],
  validator(async (req, res) => {
    try {
      const { id } = req.body;
      const sql = "DELETE FROM tag WHERE id=?";
      const result = await connection(sql, [id]);
      res.json(result);
    } catch (error) {
      console.log(error);
    }
  })
);

module.exports = router;
