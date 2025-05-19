const { user } = require("../../models");

async function createUser(data) {
  return await user.create(data);
}

async function doesUserExist(email) {
  const existingUser = await user.findOne({ where: { email } });
  return !!existingUser;
}

async function doesUserExistsById(userId) {
  const existingUser = await user.findByPk(userId);
  return !!existingUser;
}

module.exports = { doesUserExist, createUser, doesUserExistsById };
