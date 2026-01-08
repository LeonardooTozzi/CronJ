exports.up = function(knex) {
  return knex.schema.createTable('jobs_status', function(table) {
    table.increments('id').primary();
    table.text('description');
    table.boolean('active');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('jobs_status');
};
