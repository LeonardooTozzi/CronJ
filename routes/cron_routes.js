const router = require('express').Router();
const CronController = require('../controller/cron_controller');

router.get('/ping', (req, res) => {

    res.send('PING FROM CRON ROUTES, OK');

})

router.post('/', async (req, res) => {

    const cronController = new CronController()
    await cronController.CreateCronJob(req, res)
    
})

router.get('/', async (req, res) => {

    const cronController = new CronController()
    
    if (req.query && req.query.id) {
        await cronController.GetCronJob(req, res)
    } else {
        await cronController.ListCronJobs(req, res)
    }
    
})

module.exports = router;