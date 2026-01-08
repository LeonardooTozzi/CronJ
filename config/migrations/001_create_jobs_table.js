/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('jobs', function(table) {
    table.increments('id').primary()
    table.string('name', 255).notNullable()
    table.string('cron_expression', 100).notNullable()
    table.text('task_config').notNullable()
    table.integer('status').unsigned().notNullable().defaultTo(1)
    table.text('metadata')
    
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('next_execution')
    
    table.index('status', 'idx_jobs_status')
    table.index('next_execution', 'idx_jobs_next_execution')
    table.index('created_at', 'idx_jobs_created_at')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('jobs')
}

