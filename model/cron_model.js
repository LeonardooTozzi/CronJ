const DaoKnex = require('../utils/Knex');
const logger = require('logger')

class CronModel {

    constructor() {

        this.DaoKnex = new DaoKnex()

    }
  
    async CreateCronJob(cronJob) {

        try {

            return await this.DaoKnex.Query(`
                INSERT INTO 
                jobs (name, cron_expression, task_config, metadata) VALUES (?, ?, ?, ?)`, 
                [cronJob.name, cronJob.cronExpression, JSON.stringify(cronJob.task), JSON.stringify(cronJob.metadata)])

        } catch (error) {

            logger.error(`Failed to create cron job: ${error.message}`)
            throw error

        }

    }
  
}
  
module.exports = CronModel