const { Kafka } = require('kafkajs')
const logger = require('logger')

class QueueController {

    constructor() {

        const brokersEnv = process.env.KAFKA_BROKERS || 'localhost:9092'
        const brokers = brokersEnv.split(',').map(b => b.trim())

        this.kafka = new Kafka({
            clientId: process.env.KAFKA_CLIENT_ID || 'my-app',
            brokers,
            connectionTimeout: parseInt(process.env.KAFKA_CONNECTION_TIMEOUT || '10000', 10),
            requestTimeout: parseInt(process.env.KAFKA_REQUEST_TIMEOUT || '30000', 10),
            retry: {
                initialRetryTime: 100,
                retries: parseInt(process.env.KAFKA_RETRIES || '8', 10),
                multiplier: 2,
                maxRetryTime: 30000,
            },
        })

        this.producer = this.kafka.producer({ allowAutoTopicCreation: true })
        this._producerConnected = false
    }

    async _ensureProducerConnected() {

        if (!this._producerConnected) {

            await this.producer.connect()
            this._producerConnected = true

        }

    }

    async SendToQueue(topic, processData, retries = 3) {

        try {

            await this._ensureProducerConnected()

            const value = typeof processData === 'string' ? processData : JSON.stringify(processData)

            await this.producer.send({
                topic: topic,
                messages: [{ value }],
            })

        } catch (error) {

            console.error(`Error sending to Kafka topic="${topic}" brokers="${(process.env.KAFKA_BROKERS||'').slice(0,200)}"`, error)
            throw error

        }
    }

    async ConsumeFromQueue(topic, groupId, handleMessage, fromBeginning = true) {

        const consumer = this.kafka.consumer({ groupId: groupId })

        try {

            await consumer.connect()
            await consumer.subscribe({ topic: topic, fromBeginning })

            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    try {
                        handleMessage(message.value.toString())
                    } catch (handlerErr) {
                        console.error('Error in message handler', handlerErr)
                    }
                },
            })

        } catch (error) {

            console.error(`Error consuming from Kafka topic="${topic}"`, error)
            logger.error(`Error consuming from Kafka topic="${topic}"`, error)

            try {
                await consumer.disconnect()
            } catch (dErr) {
                console.error('Error disconnecting consumer after failure', dErr)
                logger.error('Error disconnecting consumer after failure', dErr)
            }
            throw error
        }
    }

    async shutdownProducer() {

        if (this._producerConnected) {

            try {

                await this.producer.disconnect()

            } catch (err) {

                console.error('Error disconnecting producer', err)

            } finally {

                this._producerConnected = false
                
            }
        }
    }
}

module.exports = QueueController