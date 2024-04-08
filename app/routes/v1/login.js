const passport = require('passport');
const head = require('lodash/head');
const get = require('lodash/get');
const {
  ErrorUnauthorized,
  httpStatus,
  successResponse,
  errorResponse
} = require('../../helpers');
const { User } = require('../../action');
const { jwtExpirationInterval } = require('../../config/variables');
/**
 * @swagger
 * /v1/login:
 *   post:
 *     summary: Login a user
 *     description: Login a user with the provided credentials
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: user
 *         description: The user to login
 *         schema:
 *           type: object
 *           required:
 *             - userName
 *             - password
 *           properties:
 *             userName:
 *               type: string
 *               description: The user's userName
 *               required: true
 *             password:
 *               type: string
 *               description: The user's password
 *               required: true
 *     responses:
 *       200:
 *         description: Login successful
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: number
 *               description: Success status code
 *             success:
 *               type: boolean
 *               description: Success statement
 *             message:
 *               type: string
 *               description: Success message
 *             data:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: The user's access token
 *                 expiresIn:
 *                   type: number
 *                   description: The number of seconds until the access token expires
 *                 refreshToken:
 *                   type: string
 *                   description: The user's refresh token
 *                 refreshTokenExpiresIn:
 *                   type: number
 *                   description: The number of seconds until the refresh token expires
 *       401:
 *         description: Unauthorized
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: number
 *               description: The HTTP status code
 *             success:
 *               type: boolean
 *               description: A boolean indicating whether the request was successful
 *             message:
 *               type: string
 *               description: A human-readable message indicating the result of the request
 *             data:
 *               type: object
 *               description: The data returned by the API
 *               nullable: true
 */

const login = (req, res, next) => {
  req
    .checkBody('userName')
    .not()
    .isEmpty()
    .withMessage('userName is requeired')
    .customSanitizer(value => String(value));

  req
    .checkBody('password')
    .not()
    .isEmpty()
    .withMessage('password is requeired')
    .customSanitizer(value => String(value));

  const errors = req.validationErrors();

  if (errors) throw Object.assign(new Error('validation errors'), { data: head(errors) });

  passport
    .authenticate('local', { session: false }, (err, user, info) => {
      try {
        if (err) throw new ErrorUnauthorized('UNAUTHORIZED');
        if (!user) throw new ErrorUnauthorized(get(info, 'message'));

        const token = User.token({
          emailAddress: get(user, 'emailAddress'),
          key: get(user, 'key'),
          userId: get(user, 'id')
        });

        if (!token) {
          throw new ErrorUnauthorized('UNAUTHORIZED');
        } else {
          const result = {
            accessToken: get(token, 'accessToken'),
            expiresIn: jwtExpirationInterval * 60,
            refreshToken: get(token, 'refreshToken'),
            refreshTokenExpiresIn: jwtExpirationInterval * 60 * 12 * 24 * 5
          };

          return res.status(httpStatus.ok).json(successResponse(req, result));
        }
      } catch (error) {
        return res.status(httpStatus.unauthorized).json(errorResponse(res, error));
      }
    })(req, res, next);
};

module.exports = (router) => {
  router.post('/', login);
};
