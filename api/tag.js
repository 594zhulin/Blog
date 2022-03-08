const express = require("express");
const { check } = require("express-validator");
const validator = require("../config/validator");
const connection = require("../config/db");
const router = express.Router();

/**
 * @typedef Tag
 * @property {string} name.required - 名称
 */

/**
 * @typedef TagId
 * @property {string} id.required - id
 */

/**
 * @typedef Response
 * @property {number} code
 * @property {string} message
 * @property {array<object>} data
 */

/**
 * @route GET /tag/get
 * @group 标签
 * @returns {Response.model} 200 - 	successful operation
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
 * @param {Tag.model} body.body.required
 * @returns {Response.model} 200 - 	successful operation
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
 * @param {Tag.model} body.body.required
 * @param {TagId.model} body.body.required
 * @returns {Response.model} 200 - 	successful operation
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
 * @param {TagId.model} body.body.required
 * @returns {Response.model} 200 - 	successful operation
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
