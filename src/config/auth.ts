export default {
  secretToken: process.env.TOKEN_SECRET,
  expiresInToken: '15m',
  secretRefreshToken: process.env.REFRESH_TOKEN_SECRET,
  expiresIdRefreshToken: '30d',
  expiresRefreshTokenDays: 30,
};
