const Tracker = require('../utils/tracker');
const CronService = require('../services/cron_service');
const QueueController = require('./queue_controller');
const CronModel = require('../model/cron_model');
const DaoKnex = require('../utils/Knex');
const CONSTANTS = require('../utils/constants');

class CronController {  

    constructor() {

        this.JobTracker = new Tracker()
        this.QueueController = new QueueController()
        this.CronModel = new CronModel()
        this.DaoKnex = new DaoKnex()

    }

    async CreateCronJob(req, res) {

        let data = req.body
        
        let transaction  = await this.DaoKnex.StartTransaction()
        
        try {

            let cronService = new CronService(data)

            let result = await this.CronModel.CreateCronJob(data)

            let dataset = {
                id: result.lastInsertRowid,
                name: data.name,
                cronExpression: data.cronExpression,
                task: data.task,
                metadata: data.metadata,
                status: 'scheduled',
                createdAt: new Date(),
                nextExecution: new Date(),
            }
            
            let cronJob = await cronService.CreateCronJob(dataset)
            
            this.JobTracker.TrackJob(cronJob.id, cronJob)

            await this.QueueController.SendToQueue('cron_jobs', JSON.stringify(cronJob))

            await this.DaoKnex.Commit(transaction)

            res.status(201).json(cronJob)

        } catch (error) {

            await this.DaoKnex.Rollback(transaction)
            res.status(500).json({ error: error.message })

        }finally {


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