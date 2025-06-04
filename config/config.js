require("dotenv").config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

module.exports = {
  development: {
    use_env_variable: "DATABASE_URL",
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    dialectModule: require("pg"),
  },
  test: {
    use_env_variable: "TEST_DATABASE_URL",
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    dialectModule: require("pg"),
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectModule: require("pg"),
  },
};
