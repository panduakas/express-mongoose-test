/* eslint-disable import/no-extraneous-dependencies */
const Queue = require('bull');
const head = require('lodash/head');
const get = require('lodash/get');
const { wrap } = require('../../helpers');
const UserSchema = require('../../models/user.model');
const { authJWT } = require('../../middlewares/auth');

const queue = new Queue('Operation');

/**
 * @swagger
 * /v1/operation:
 *   get:
 *     summary: Get user by identity number
 *     description: Get user by identity number
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: The user's access token
 *       - in: query
 *         name: accountNumber
 *         schema:
 *           type: string
 *         required: true
 *         description: The user's identity number
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   description: Success status code
 *                 success:
 *                   type: boolean
 *                   description: Success statement
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       description: The user's ID
 *                     userName:
 *                       type: string
 *                       description: The user's name
 *                     accessToken:
 *                       type: string
 *                       description: The user's access token
 *                     expiresIn:
 *                       type: number
 *                       description: The number of seconds until the access token expires
 *                     refreshToken:
 *                       type: string
 *                       description: The user's refresh token
 *                     refreshTokenExpiresIn:
 *                       type: number
 *                       description: The number of seconds until the refresh token expires
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   description: The HTTP status code
 *                 success:
 *                   type: boolean
 *                   description: A boolean indicating whether the request was successful
 *                 message:
 *                   type: string
 *                   description: A human-readable message indicating the result of the request
 *                 data:
 *                   type: object
 *                   description: The data returned by the API
 *                   nullable: true
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   description: The HTTP status code
 *                 success:
 *                   type: boolean
 *                   description: A boolean indicating whether the request was successful
 *                 message:
 *                   type: string
 *                   description: A human-readable message indicating the result of the request
 *                 data:
 *                   type: object
 *                   description: The data returned by the API
 *                   nullable: true
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   description: The HTTP status code
 *                 success:
 *                   type: boolean
 *                   description: A boolean indicating whether the request was successful
 *                 message:
 *                   type: string
 *                   description: A human-readable message indicating the result of the request
 *                 data:
 *                   type: object
 *                   description: The data returned by the API
 *                   nullable: true
 * securitySchemes:
 *   BearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT
 */
const getDetail = async (req) => {
  req.checkQuery('accountNumber').not().isEmpty().withMessage('accountNumber is required')
    .customSanitizer(value => String(value))
    .trim()
    .escape();

  const errors = req.validationErrors();
  if (errors) throw Object.assign(new Error('Validation Errors'), { data: head(errors) });

  const query = await UserSchema.findOne({ accountNumber: get(req, 'query.accountNumber') }).exec();

  if (query) {
    queue.add({
      data: query
    });
  }

  return query;
};

module.exports = (router) => {
  router.get('/', authJWT(), wrap(getDetail));
};
