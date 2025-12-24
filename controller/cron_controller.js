const Tracker = require('../utils/tracker');
const CronService = require('../services/cron_service');
const QueueController = require('./queue_controller');
const CronModel = require('../model/cron_model');

class CronController {  

    constructor() {

        this.JobTracker = new Tracker()
        this.QueueController = new QueueController()
        this.CronModel = new CronModel()

    }

    async CreateCronJob(req, res) {

        let data = req.body
        
        this.DaoKnex = await this.DaoKnex.StartTransaction()
        
        try {

            let cronService = new CronService(data)

            let cronJob = await cronService.CreateCronJob()

            await this.CronModel.CreateCronJob(cronJob)

            // Track job in memory
            this.JobTracker.TrackJob(cronJob.id, cronJob)

            // Send to queue (fire and forget, but await to catch errors)
            await this.QueueController.SendToQueue('cron_jobs', JSON.stringify(cronJob))

            // Commit transaction on success
            await this.DaoKnex.Commit(transaction)

            res.status(201).json(cronJob)

        } catch (error) {

            await this.DaoKnex.Rollback()
            res.status(500).json({ error: error.message })

        }finally {

            await this.DaoKnex.Commit()

        }

    }

    async ListCronJobs(req, res) {

        try {

            const cronJobs = this.JobTracker.GetTrackedJobs()
            res.status(200).json(cronJobs)

        } catch (error) {

            res.status(500).json({ error: error.message })

        }

    }

    async GetCronJob(req, res) {

        let data = req.query

        try {

            const cronJob = await this.JobTracker.GetJobById(data.id)
            
            if (!cronJob) {
                return res.status(404).json({ error: 'Cron job not found' })
            }
            
            res.status(200).json(cronJob)

        } catch (error) {

            res.status(500).json({ error: error.message })

        }

    }

    async DeleteCronJob(req, res) {

        try {

            await this.CronModel.DeleteCronJob(req.params.id)

            res.status(200).json({ message: 'Job deleted successfully', id: req.params.id })

        } catch (error) {

            res.status(500).json({ error: error.message })

        }

    }

}

module.exports = CronController