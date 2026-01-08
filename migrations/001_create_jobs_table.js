exports.up = function(knex) {
  return knex.schema.createTable('jobs', function(table) {
    table.increments('id').primary()
    table.string('name').notNullable();
    table.string('cron_expression').notNullable();
    table.text('task_config').notNullable(); // JSON as TEXT
    table.integer('status').unsigned().notNullable().defaultTo(1);
    table.text('metadata'); // JSON as TEXT
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.foreign('status').references('id').inTable('jobs_status');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('jobs');
};
