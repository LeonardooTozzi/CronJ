/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  if (knex.client.config.client === 'pg') {
    return knex.raw(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';

      CREATE TRIGGER update_jobs_updated_at 
      BEFORE UPDATE ON jobs
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `)
  }
  return Promise.resolve()
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  if (knex.client.config.client === 'pg') {
    return knex.raw(`
      DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
      DROP FUNCTION IF EXISTS update_updated_at_column();
    `)
  }
  return Promise.resolve()
}

