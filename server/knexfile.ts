// Update with your config settings.
const { parse } = require('pg-connection-string');

module.exports = {
  development: {
    client: "pg",
    connection: {
      database: "lovestream",
      user: "admin",
      password: "love"
    }
  },
  production: {
    client: "pg",
    connection: process.env.DATABASE_URL ? {
      ssl: true,
      ...parse(process.env.DATABASE_URL)
    } : false
  }
};
