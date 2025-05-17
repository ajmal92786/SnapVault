function isRequestBodyValid(body) {
  return body.username && body.email;
}

function isUsernameValid(username) {
  return typeof username === "string" && username.trim().length > 0;
}

function isEmailValid(email) {
  return (
    typeof email === "string" && email.includes("@") && email.includes(".")
  );
}

module.exports = { isRequestBodyValid, isUsernameValid, isEmailValid };
