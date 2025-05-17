const { user } = require("../../models");

async function doesUserExist(email) {
  const existingUser = await user.findOne({ where: { email } });
  return !!existingUser;
}

async function createUser(data) {
  return await user.create(data);
}

module.exports = { doesUserExist, createUser };
