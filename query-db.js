const sqlite3 = require('sqlite3').verbose();
const sql = process.argv.slice(2).join(' ') || "SELECT name FROM sqlite_master WHERE type='table'";
const db = new sqlite3.Database('./cron.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err.message || err);
    process.exit(1);
  }
  db.all(sql, (err, rows) => {
    if (err) {
      console.error('Query error:', err.message || err);
      process.exit(1);
    }
    console.log(JSON.stringify(rows, null, 2));
    db.close();
  });
});
