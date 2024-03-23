// Creating access token and saving in cookie --

const generateAccessToken = (user, statusCode, res) => {
  const access_token = user.getAccessToken();

  // cookies options --
  const options = {
    expiresIn: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", access_token, options).json({
    success: true,
    user,
    access_token,
  });
};

export { generateAccessToken };
