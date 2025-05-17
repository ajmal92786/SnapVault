const {
  isRequestBodyValid,
  isUsernameValid,
  isEmailValid,
} = require("../validations/userValidations");
const { doesUserExist, createUser } = require("../services/userService");

const createNewUser = async (req, res) => {
  const { username, email } = req.body;

  // Validate presence of fields (username and email)
  if (!isRequestBodyValid(req.body)) {
    return res
      .status(400)
      .json({ message: "Username and email are required." });
  }

  // Validate individual fields
  if (!isUsernameValid(username)) {
    return res.status(400).json({ message: "Invalid username." });
  }

  if (!isEmailValid(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  // Check if user already exists
  const userExists = await doesUserExist(email);
  if (userExists) {
    return res.status(400).json({ message: "Email already exists." });
  }

  // Create user
  try {
    const newUser = await createUser({ username, email });
    return res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({ messge: "Something went wrong.", error });
  }
};

module.exports = {
  createNewUser,
};
