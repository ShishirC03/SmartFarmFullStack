const { check } = require("express-validator");

exports.validateUser = [
  check("name")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Name is missing!")
    .isLength({ min: 3, max: 20 })
    .withMessage("Name must be 3 to 20 characters long!"),

  check("email")
    .normalizeEmail()
    .isEmail()
    .withMessage("Email is invalid!"),
];

