exports.up = function(knex) {
  if (knex.client.config.client === 'pg') {
    return knex.raw(`
      CREATE OR REPLACE FUNCTION update_jobs_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
      
      CREATE TRIGGER update_jobs_updated_at_trigger
      BEFORE UPDATE ON jobs
      FOR EACH ROW
      EXECUTE FUNCTION update_jobs_updated_at();
    `);
  }
  return Promise.resolve();
};

exports.down = function(knex) {
  if (knex.client.config.client === 'pg') {
    return knex.raw(`
      DROP TRIGGER IF EXISTS update_jobs_updated_at_trigger ON jobs;
      DROP FUNCTION IF EXISTS update_jobs_updated_at();
    `);
  }
  return Promise.resolve();
};
