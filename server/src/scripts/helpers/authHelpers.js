const hash = require('object-hash');
const jwt = require('jsonwebtoken');
const env = require('../../config')

const hashPassword = (password) => {
  return hash(password);
};

const generateAccessToken = async (data) => {
  return jwt.sign(data, env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
};

const generateRefreshToken = async (data) => {
  return jwt.sign(data, env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
};

const comparePasswords = (password, databasePassword) => {
  const clientPassword = hash(password);
  return clientPassword === databasePassword;
};

module.exports = {
  hashPassword,
  generateAccessToken,
  generateRefreshToken,
  comparePasswords,
};