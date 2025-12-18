class Tracker {

    constructor() {

        this.trackedJobs = new Map()
        
    }

    TrackJob(jobId, jobDetails) {

        this.trackedJobs.set(jobId, jobDetails)

    }

    GetTrackedJobs() {

        return Array.from(this.trackedJobs.values())

    }

    GetJobById(jobId) {

        return this.trackedJobs.get(jobId)
    
    }

}

module.exports = Tracker;