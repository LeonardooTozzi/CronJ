exports.up = function(knex) {
  return knex.schema.createTable('executions_status', function(table) {
    table.text('id').primary();
    table.text('description');
    table.boolean('active');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('executions_status');
};
