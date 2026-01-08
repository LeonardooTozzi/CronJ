const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cron.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err);
    return;
  }
  console.log('Connected to database');
  
  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
    if (err) {
      console.error('Error querying tables:', err);
    } else {
      console.log('Tables in database:');
      console.log(JSON.stringify(rows, null, 2));
    }
    db.close();
  });
});
