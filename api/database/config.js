module.exports = {
  use_env_variable: false,
  development: {
    host: "db",
    port: "5432",
    database: "sia-db",
    dialect: "postgres",
    username: "sia-user",
    password: "sia-pass"
  }
};
