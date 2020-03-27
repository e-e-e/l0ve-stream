// Update with your config settings.

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
    connection: process.env.DATABASE_URL
  }
};
