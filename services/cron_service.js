const cron = require('node-cron');

class CronService {
 
    constructor(data) {

        this.id = data.id
        this.cronExpression = data.cronExpression
        this.task = data.task
        this.createdAt = data.createdAt

    }

    async CreateCronJob() {

        try {

            const cronJob = {
                id: this.id,
                cronExpression: this.cronExpression,
                task: this.task,
                createdAt: this.createdAt
            };

            cron.schedule(this.cronExpression, () => {
                console.log('running ', this.task);
            });

            return cronJob;

        } catch (error) {

            throw new Error(`Failed to create cron job: ${error.message}`);

        }

    }

}

module.exports = CronService