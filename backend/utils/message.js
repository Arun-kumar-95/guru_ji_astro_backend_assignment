const SuccessMessage = (statusCode, message, res) => {
  return res.status(statusCode).json({
    success: true,
    message,
  });
};

module.exports = SuccessMessage;
