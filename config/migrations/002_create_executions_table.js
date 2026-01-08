/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('executions', function(table) {
    table.string('id', 36).primary()
    
    table.string('job_id', 36).notNullable()
      .references('id')
      .inTable('jobs')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
    
    table.string('status', 20).notNullable()
      .checkIn(['success', 'failed', 'retrying'])
    
    table.timestamp('started_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('completed_at')
    
    table.integer('duration')
    
    table.text('result')
    table.text('error')
    
    table.index('job_id', 'idx_executions_job_id')
    table.index('status', 'idx_executions_status')
    table.index('started_at', 'idx_executions_started_at')
    table.index(['job_id', 'started_at'], 'idx_executions_job_started')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('executions')
}

