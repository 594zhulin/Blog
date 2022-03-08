const express = require("express");
const { check } = require("express-validator");
const validator = require("../config/validator");
const connection = require("../config/db");
const { setToken } = require("../config/token");
const router = express.Router();

/**
 * @typedef User
 * @property {string} username.required - 用户名
 * @property {string} password.required - 密码
 */

/**
 * @typedef UserInfo
 * @property {string} id.required - id
 * @property {string} avatar.required - 头像
 * @property {string} username.required - 用户名
 * @property {string} birthday.required - 生日
 * @property {number} sex.required - 性别
 */

/**
 * @typedef UserId
 * @property {string} id.required - id
 */

/**
 * @typedef Response
 * @property {number} code
 * @property {string} message
 * @property {array<object>} data
 */

/**
 * @route GET /user/get
 * @group 用户
 * @returns {Response.model} 200 - 	successful operation
 */
router.get("/get", async (req, res) => {
  try {
    const sql = "SELECT * FROM user";
    const result = await connection(sql);
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

/**
 * @route POST /user/register
 * @group 用户
 * @param {User.model} body.body.required
 * @returns {Response.model} 200 - 	successful operation
 */
router.post(
  "/register",
  [
    check("username", "4-16位，支持数字、字母、下划线和短横线").matches(
      /^[a-zA-Z0-9_-]{4,16}$/
    ),
    check(
      "password",
      "6-20位，至少包括1个大写字母，1个小写字母，1个数字，1个特殊字符"
    ).matches(
      /^.*(?=.{6,20})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/
    ),
  ],
  validator(async (req, res) => {
    try {
      const { username, password } = req.body;
      const sql = "INSERT INTO user(username,password) values(?,?)";
      const result = await connection(sql, [username, password]);
      res.json(result);
    } catch (error) {
      if (error.errno === 1062) {
        res.json({
          code: -1,
          message: "用户名已存在",
        });
      }
      console.log(error);
    }
  })
);

/**
 * @route POST /user/login
 * @group 用户
 * @param {User.model} body.body.required
 * @returns {Response.model} 200 - 	successful operation
 */
router.post(
  "/login",
  [
    check("username", "username不能为空").notEmpty(),
    check("password", "password不能为空").notEmpty(),
  ],
  validator(async (req, res) => {
    try {
      const { username, password } = req.body;
      const sql = "SELECT username,password FROM user WHERE username=?";
      const result = await connection(sql, username, "登录");
      const { code, message, data } = result;
      if (data.length === 0) {
        res.json({
          code: -1,
          message: "用户不存在",
        });
        return;
      } else {
        if (data[0].password === password) {
          setToken({
            username: data[0].username,
            userid: data[0].id,
          }).then((token) => {
            res.json({
              code,
              message,
              token,
            });
          });
        } else {
          res.json({
            code,
            message: "密码错误",
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  })
);

/**
 * @route PUT /user/update
 * @group 用户
 * @param {UserInfo.model} body.body.required
 * @returns {Response.model} 200 - 	successful operation
 */
router.put(
  "/update",
  [
    check("id").notEmpty().withMessage("id不能为空").isString(),
    check("avatar").notEmpty().withMessage("avatar不能为空").isString(),
    check("username", "4-16位，支持数字、字母、下划线和短横线").matches(
      /^[a-zA-Z0-9_-]{4,16}$/
    ),
    check("birthday").notEmpty().withMessage("birthday不能为空").isDate(),
    check("sex").notEmpty().withMessage("sex不能为空").isNumeric(),
  ],
  validator(async (req, res) => {
    try {
      const { id, avatar, username, birthday, sex } = req.body;
      const sql =
        "UPDATE user SET avatar=?, username=?, birthday=?, sex=? WHERE id=?";
      const result = await connection(sql, [
        avatar,
        username,
        birthday,
        sex,
        id,
      ]);
      res.json(result);
    } catch (error) {
      if (error.errno === 1062) {
        res.json({
          code: -1,
          message: "用户名已存在",
        });
      }
      console.log(error);
    }
  })
);

/**
 * @route DELETE /user/delete
 * @group 用户
 * @param {UserId.model} body.body.required
 * @returns {Response.model} 200 - 	successful operation
 */
router.delete(
  "/delete",
  [check("id").notEmpty().withMessage("id不能为空").isString()],
  validator(async (req, res) => {
    try {
      const { id } = req.body;
      const sql = "DELETE FROM user WHERE id=?";
      const result = await connection(sql, [id]);
      res.json(result);
    } catch (error) {
      console.log(error);
    }
  })
);

module.exports = router;
