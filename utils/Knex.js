const knex = require('knex')
const config = require('../config/config')
const logger = require('logger')

class DaoKnex {

    constructor() {
        const env = process.env.NODE_ENV || 'development'
        this.knex = knex(config[env])
    }

    SetLogQueries(logQueries) {
        this.logQueries = logQueries
    }

    async Query(query, bindings = []) {
        if (this.logQueries) {
            logger.info(`Query: ${query}`, bindings.length > 0 ? `Bindings: ${JSON.stringify(bindings)}` : '')
        }
        return this.knex.raw(query, bindings)
    }
    async QueryWithTrx(query, bindings = [], trx = null) {
        if (this.logQueries) {
            logger.info(`Query: ${query}`, bindings.length > 0 ? `Bindings: ${JSON.stringify(bindings)}` : '')
        }
        const executor = trx ? trx.raw.bind(trx) : this.knex.raw.bind(this.knex)
        return executor(query, bindings)
    }

    async Close() {
        await this.knex.destroy()
    }

    // Start a transaction and return the trx object. Caller must commit/rollback or
    // use `executeInTransaction` helper which handles commit/rollback for you.
    async StartTransaction() {
        const trx = await this.knex.transaction()
        return trx
    }

    // Commit a manually-managed transaction
    async Commit(trx) {
        if (!trx) throw new Error('Commit requires a transaction object')
        await trx.commit()
    }

    // Rollback a manually-managed transaction
    async Rollback(trx) {
        if (!trx) throw new Error('Rollback requires a transaction object')
        await trx.rollback()
    }

    // Convenience wrapper: accepts a callback that receives `trx` and automatically
    // commits on success or rolls back on error.
    async executeInTransaction(callback) {
        return this.knex.transaction(async (trx) => {
            try {
                const result = await callback(trx)
                return result
            } catch (err) {
                // Re-throw so knex will rollback the transaction
                throw err
            }
        })
    }
}

module.exports = DaoKnex