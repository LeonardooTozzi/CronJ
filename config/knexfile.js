module.exports = {
  development: {
    client: 'sqlite3',
    connection: { filename: '../cron.sqlite' },
    useNullAsDefault: true,
    migrations: { directory: '../migrations' }
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: { directory: '../migrations' }
  }
};