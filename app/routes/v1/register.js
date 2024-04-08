const head = require('lodash/head');
const { User } = require('../../action');
const { httpStatus, wrap } = require('../../helpers');
/**
 * @swagger
 * /v1/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with the provided details
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: user
 *         description: The user to create.
 *         schema:
 *           type: object
 *           required:
 *             - userName
 *           properties:
 *             userName:
 *               type: string
 *               description: The user's name
 *               required: true
 *             accountNumber:
 *               type: string
 *               description: The user's account number
 *               required: true
 *             emailAddress:
 *               type: string
 *               format: email
 *               description: The user's email address
 *               required: true
 *             password:
 *               type: string
 *               description: The user's password
 *               required: true
 *             confirmPassword:
 *               type: string
 *               description: The user's confirmation password
 *               required: true
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 message:
 *                   type: string
 *                   description: The response message
 *                 data:
 *                   type: object
 *                   description: The created user object
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 message:
 *                   type: string
 *                   description: The error message
 *                 data:
 *                   type: object
 *                   description: The error details
 */
const register = async (req) => {
  req.checkBody('userName').not().isEmpty().withMessage('userName is required')
    .customSanitizer(value => String(value))
    .trim()
    .escape();
  req.checkBody('accountNumber').not().isEmpty().withMessage('accountNumber is required')
    .customSanitizer(value => String(value))
    .trim()
    .escape();
  req.checkBody('emailAddress').not().isEmpty().withMessage('emailAddress is required')
    .isEmail()
    .withMessage('Invalid emailAddress format')
    .customSanitizer(value => String(value))
    .trim()
    .escape();
  req.checkBody('password').not().isEmpty().withMessage('Password is required')
    .customSanitizer(value => String(value))
    .trim()
    .escape();
  req.checkBody('confirmPassword').not().isEmpty().withMessage('Confirm password is required')
    .customSanitizer(value => String(value))
    .trim()
    .escape();

  const errors = req.validationErrors();
  if (errors) throw Object.assign(new Error('Validation Errors'), { data: head(errors) });

  const {
    userName,
    emailAddress,
    password,
    confirmPassword,
    accountNumber,
  } = req.body;

  // check password
  if (password !== confirmPassword) throw new Error('Password confirmation does not match');

  const user = await User.register({
    userName,
    emailAddress,
    password,
    accountNumber,
  });

  const result = {
    status: httpStatus.created,
    message: 'Registration Success!',
    data: user,
  };
  return result;
};
module.exports = (router) => {
  router.post('/', wrap(register));
};
