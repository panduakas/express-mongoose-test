const head = require('lodash/head');
const { User } = require('../../action/v1/user');
const { wrap } = require('../../helpers');
const { jwtExpirationInterval } = require('../../config/variables');
/**
 * @swagger
 * /v1/refresh-token:
 *   post:
 *     summary: Refresh a user's token
 *     description: Refresh a user's token with the provided refresh token
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: refreshToken
 *         description: The user's refresh token
 *         schema:
 *           type: object
 *           required:
 *             - refreshToken
 *           properties:
 *             refreshToken:
 *               type: string
 *               description: The user's refresh token
 *               required: true
 *     responses:
 *       200:
 *         description: Token refreshed successfully
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
 *                     accessToken:
 *                       type: string
 *                       description: The user's new access token
 *                     expiresIn:
 *                       type: number
 *                       description: The number of seconds until the access token expires
 *                     refreshToken:
 *                       type: string
 *                       description: The user's new refresh token
 *                     refreshTokenExpiresIn:
 *                       type: number
 *                       description: The number of seconds until the refresh token expires
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
 */

const refreshTokenApi = async (req) => {
  req.checkBody('refreshToken').not().isEmpty().withMessage('refreshToken is required');

  const errors = req.validationErrors();
  if (errors) throw Object.assign(new Error('Validation Errors'), { data: head(errors) });

  const {
    refreshToken
  } = req.body;

  const user = await User.verifyRefreshToken({
    refreshToken
  });

  const result = {
    data: {
      accessToken: user.accessToken,
      expiresIn: jwtExpirationInterval * 60,
      refreshToken: user.refreshToken,
      refreshTokenExpiresIn: jwtExpirationInterval * 60 * 12 * 24 * 5
    },
  };
  return result;
};
module.exports = (router) => {
  router.post('/', wrap(refreshTokenApi));
};
