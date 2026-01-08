exports.up = async function(knex) {
  // Fill existing NULL ids with a 32-char hex id (lowercase)
  await knex.raw("UPDATE jobs SET id = lower(hex(randomblob(16))) WHERE id IS NULL");
  await knex.raw("UPDATE executions SET id = lower(hex(randomblob(16))) WHERE id IS NULL");

  // Create AFTER INSERT triggers to set id if it was not provided
  await knex.raw(`
    CREATE TRIGGER IF NOT EXISTS jobs_set_id_after_insert
    AFTER INSERT ON jobs
    WHEN NEW.id IS NULL OR NEW.id = ''
    BEGIN
      UPDATE jobs SET id = lower(hex(randomblob(16))) WHERE rowid = NEW.rowid;
    END;
  `);

  await knex.raw(`
    CREATE TRIGGER IF NOT EXISTS executions_set_id_after_insert
    AFTER INSERT ON executions
    WHEN NEW.id IS NULL OR NEW.id = ''
    BEGIN
      UPDATE executions SET id = lower(hex(randomblob(16))) WHERE rowid = NEW.rowid;
    END;
  `);
};

exports.down = async function(knex) {
  await knex.raw('DROP TRIGGER IF EXISTS jobs_set_id_after_insert');
  await knex.raw('DROP TRIGGER IF EXISTS executions_set_id_after_insert');
};
