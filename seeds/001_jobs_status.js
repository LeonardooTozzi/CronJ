exports.seed = function(knex) {
  return knex('jobs_status').del()
    .then(function () {
      return knex('jobs_status').insert([
        { id: 1, description: 'Active', active: true },
        { id: 2, description: 'Inactive', active: true },
        { id: 3, description: 'Failed', active: true }
      ])
    })
}
