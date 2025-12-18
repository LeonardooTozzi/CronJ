const router = require('express').Router();
const CronController = require('../controller/cron_controller');

router.get('/ping', (req, res) => {

    res.send('PING FROM CRON ROUTES, OK');

})

router.post('/new_job', async (req, res) => {

    const cronController = new CronController()
    await cronController.CreateCronJob(req, res)
    
})

module.exports = router;