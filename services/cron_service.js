const cron = require('node-cron');

class CronService {
 
    constructor(data) {

        
        this.cronExpression = data.cronExpression
        this.task = data.task
        this.metadata = data.metadata

        // {
        //     "id": "job-uuid-123",
        //     "name": "Daily Report",
        //     "cronExpression": "0 9 * * *",
        //     "status": "scheduled",
        //     "createdAt": "2025-12-23T18:30:00Z",
        //     "nextExecution": "2025-12-24T09:00:00Z",
        //     "metadata": { ... }
        // }

    }

    async CreateCronJob() {

        try {

            const cronJob = {
                cronExpression: this.cronExpression,
                task: this.task,
                metadata: this.metadata,
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