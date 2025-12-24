class Tracker {

    constructor() {
        // Use singleton pattern - share the same Map across all instances
        if (Tracker.instance) {
            return Tracker.instance
        }

        this.trackedJobs = new Map()
        Tracker.instance = this
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