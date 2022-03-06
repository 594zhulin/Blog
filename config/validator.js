const { validationResult } = require("express-validator");

const validator = (fn) => (req, res) => {
  return new Promise((resolve, reject) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res
        .status(400)
        .json({ code: -1, message: "参数格式错误", data: errors.array() });
    } else {
      resolve(fn(req, res));
    }
  });
};

module.exports = validator;
