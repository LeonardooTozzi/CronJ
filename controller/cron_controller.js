const Tracker = require('../utils/tracker');
const CronService = require('../services/cron_service');
const QueueController = require('./queue_controller');

class CronController {  

    constructor() {

        this.JobTracker = new Tracker()
        this.QueueController = new QueueController()

    }

    async CreateCronJob(req, res) {

        let data = req.body
        
        try {

            let cronService = new CronService(data)

            let cronJob = await cronService.CreateCronJob()

            this.JobTracker.TrackJob(cronJob.id, cronJob)
            this.QueueController.SendToQueue('cron_jobs', JSON.stringify(cronJob))

            res.status(201).json(cronJob)

        } catch (error) {

            res.status(500).json({ error: error.message })

        }

    }

    async ListCronJobs(req, res) {

        try {

            const cronJobs = await this.cronService.listCronJobs()
            res.status(200).json(cronJobs)

        } catch (error) {

            res.status(500).json({ error: error.message })

        }

    }

    async DeleteCronJob(req, res) {

        try {

            const cronJob = await this.cronService.deleteCronJob(req.params.id)
            res.status(200).json(cronJob)

        } catch (error) {

            res.status(500).json({ error: error.message })

        }

    }

}

module.exports = CronController