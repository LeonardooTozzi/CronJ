exports.up = function(knex) {
  return knex.schema.createTable('executions', function(table) {
    table.text('id').primary();
    table.text('job_id').notNullable();
    table.enum('status', ['pending', 'running', 'success', 'failed']).defaultTo('pending');
    table.timestamp('started_at');
    table.timestamp('completed_at');
    table.integer('duration'); 
    table.text('result'); 
    table.text('error'); 
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.foreign('job_id').references('id').inTable('jobs').onDelete('CASCADE');
    table.foreign('status').references('id').inTable('executions_status');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('executions');
};
