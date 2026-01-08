exports.up = async function(knex) {

  await knex.transaction(async (trx) => {
    await trx.raw('PRAGMA foreign_keys = OFF');
    
    await trx.raw(`
      CREATE TABLE jobs_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        cron_expression TEXT NOT NULL,
        task_config TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        metadata TEXT,
        created_at TEXT,
        updated_at TEXT
      );
    `);

    await trx.raw(`
      CREATE TABLE executions_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        job_id INTEGER NOT NULL,
        status TEXT DEFAULT 'pending',
        started_at TEXT,
        completed_at TEXT,
        duration INTEGER,
        result TEXT,
        error TEXT,
        created_at TEXT,
        FOREIGN KEY(job_id) REFERENCES jobs(id) ON DELETE CASCADE
      );
    `);

    // Record old rowid so we can preserve insertion order and build mapping
    await trx.raw('ALTER TABLE jobs ADD COLUMN old_rowid INTEGER');
    await trx.raw('UPDATE jobs SET old_rowid = rowid');

    // Copy jobs into new table in the same order
    await trx.raw(`
      INSERT INTO jobs_new (name, cron_expression, task_config, status, metadata, created_at, updated_at)
      SELECT name, cron_expression, task_config, status, metadata, created_at, updated_at FROM jobs ORDER BY old_rowid;
    `);

    // Build mapping from old text id -> new integer id
    await trx.raw('CREATE TEMP TABLE job_id_map(old_id TEXT, new_id INTEGER)');
    await trx.raw(`
      INSERT INTO job_id_map(old_id, new_id)
      SELECT jobs.id, jobs_new.id
      FROM jobs JOIN jobs_new ON jobs.old_rowid = jobs_new.rowid;
    `);

    // Copy executions using mapped job ids
    await trx.raw(`
      INSERT INTO executions_new (job_id, status, started_at, completed_at, duration, result, error, created_at)
      SELECT job_id_map.new_id, executions.status, executions.started_at, executions.completed_at, executions.duration, executions.result, executions.error, executions.created_at
      FROM executions JOIN job_id_map ON executions.job_id = job_id_map.old_id ORDER BY executions.rowid;
    `);

    // Drop old tables and rename new ones
    await trx.raw('DROP TABLE executions');
    await trx.raw('DROP TABLE jobs');
    await trx.raw('ALTER TABLE jobs_new RENAME TO jobs');
    await trx.raw('ALTER TABLE executions_new RENAME TO executions');

    // Cleanup
    await trx.raw('DROP TABLE IF EXISTS job_id_map');

    await trx.raw('PRAGMA foreign_keys = ON');
  });
};

exports.down = async function(knex) {
  // Reverting this migration is non-trivial; throw to avoid accidental rollback.
  throw new Error('Down migration not implemented for convert_ids_to_integer');
};
