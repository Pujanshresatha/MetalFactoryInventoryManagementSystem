const errorResponse = (res, statusCode, message) => {
    res.status(statusCode).json({ message });
  };
  
  module.exports = { errorResponse };