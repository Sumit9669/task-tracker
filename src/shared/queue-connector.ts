import amqp, { Channel, Connection } from 'amqplib';
import logger from '@shared/logger';
import lodash from 'lodash';
import app from '@server';
import { BusinessEntities, ConnectionType, EntityType } from 'src/enums/common-enums';
import { MQueueData } from 'src/interfaces-and-types/queue-data.type.interface';
import { QueueDataSchema } from 'src/schema-validations/schemas/queue.validation';
import { QueueReceivedMessageHandler } from 'src/services/queue-handler.service';
import { MQueueMailData } from 'src/interfaces-and-types/queue-data-mail.interface';
import { CommonFunctions } from './common-functions';
import { OperationType } from 'src/enums/operation-types';
const queueReceivedMessageHandler = new QueueReceivedMessageHandler();
const commonFunction = new CommonFunctions();
export class QueueConnector {

  /**
   * Channel for sender Queue should be defined once
   */
  private static senderQueueChannel: Channel;

  /**
   * Conection Url for rabbit MQ
   */
  private static ConnUrl: string = process.env.RABBITQUEUE_URL || '';

  /**
   * Options passed such as credentials
   */
  private static opt: any = {
    credentials: amqp.credentials.plain(
      process.env.RABBITQUEUE_USER_NAME || '',
      process.env.RABBITQUEUE_USER_PASS || ''
    )
  };

  /**
   * will create connection with rabbit mq server
   */
  public static async createConnection(): Promise<amqp.Connection> {
    try {
      // creating connection to Rabbit MQ
      return await amqp.connect(this.ConnUrl, this.opt);
    } catch (err: any) {
      logger.error(err);
      throw err;
    }
  }

  /**
   * will return the connection based on connection Type
   * @param connectionType pass the connection Type for getting the connection
   */
  public static async getQueueConnection(connectionType: ConnectionType): Promise<amqp.Connection> {
    try {
      // check connection if exist in global variable
      let conn: amqp.Connection = app.get(connectionType);
      // If not exist then Get channel connection
      if (!conn) {
        conn = await this.createConnection();
        app.set(connectionType, conn);
      }
      return conn;
    } catch (err: any) {
      logger.error(err);
      throw err;
    }
  }

  /**
   * Recieve message from Queue
   * @param queueName pass the queue name
   */
  public static async startConsumingQueue() {

    try {
      const dataManagementQueue = process.env.FAI_DATABASE_MANAGEMENT_QUEUE as string;
      const webhookDataManagementQueue = process.env.FAI_WEBHOOK_DATABASE_MANAGEMENT_QUEUE as string;


      // Get chhanel connection if not exist
      const conn: amqp.Connection = await this.getQueueConnection(ConnectionType.reciever);
      const ch: amqp.Channel = await conn.createChannel();

      // get one message at a time
      ch.prefetch(1);
      // consume data of Data Management Queue
      QueueConnector.consumeDataManagementQueue(ch, dataManagementQueue);
      // webhook Data Management Queue
      QueueConnector.consumeWebhookDataManagementQueue(ch, webhookDataManagementQueue);
    } catch (err: any) {
      logger.error(err);
      throw err;
    }
  }

  /**
   * add message data to queue
   * @param queueName pass the queue name
   * @param data pass the data
   */
  static async sendMessageToQueue(queueName?: string, data?: MQueueData) {
    if (queueName === undefined || data === undefined) {
      logger.error('Queue Error: PROCESS EXITING\n' + new Error().stack);
      process.exit(1);
    }
    try {
      // Check channel exist or not. If not then create it from connection again.
      if (!this.senderQueueChannel) {
        // Get sender connection
        const conn: Connection = await this.getQueueConnection(ConnectionType.sender);
        // Create new channel
        this.senderQueueChannel = await conn.createChannel();
      }

      this.senderQueueChannel.assertQueue(queueName, {
        durable: true
      });

      // send message data to queue
      this.senderQueueChannel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
    } catch (err: any) {
      console.log(err);
      logger.error(err.message || err.stack);
      throw err;
    }
  }

  static consumeDataManagementQueue(ch: amqp.Channel, queueName: string) {
    ch.assertQueue(queueName, {
      durable: true
    });
    ch.consume(queueName, async (msg: any) => {
      try {
        // loading json data from the queue and converting it into json format
        const queueData = JSON.parse(msg.content.toString());
        // validating queue data
        const reqObject = QueueDataSchema.validate(queueData);
        if (reqObject.error) {
          throw reqObject.error;
        } else {
          await queueReceivedMessageHandler.processRecieverQueueData(reqObject.value);
        }
      } catch (err: any) {
        const count = msg.properties.headers && msg.properties.headers['x-retries'] || 0;
        if (count < 3) {
          let retry_delay = 3000 * (count + 1);
          const opts = { headers: { 'x-retries': count + 1, 'x-delay': retry_delay } };
          ch.publish(process.env.RABBITQUEUE_RETRY_EXCHANGE_NAME as string, queueName, Buffer.from(msg.content.toString()), opts);
        } else {
          logger.info("Retried 3 times Now sending data to error logging  ")
          const errMes = JSON.parse(msg.content.toString());
          errorlogService.prepareAndSendErrorQueueData(EntityType.errorLogging, OperationType.create, errMes, err);
          logger.error(err.message);
        }

      }
      // ack message after processing
      ch.ack(msg);
    }, {
      noAck: false
    });
  }

  /**
   * add message data to queue
   * @param queueName pass the queue name
   * @param data pass the data
   */
  static async sendMessageToMailQueue(queueName: string, data: MQueueMailData) {
    try {
      // Check channel exist or not. If not then create it from connection again.
      if (!this.senderQueueChannel) {
        // Get sender connection
        const conn: Connection = await QueueConnector.getQueueConnection(ConnectionType.sender);
        // Create new channel
        this.senderQueueChannel = await conn.createChannel();
      }

      this.senderQueueChannel.assertQueue(queueName, {
        durable: true
      });

      // send message data to queue
      this.senderQueueChannel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
    } catch (err: any) {
      logger.error(err.message || err.stack);
      throw err;
    }
  }

  static async consumeWebhookDataManagementQueue(ch: amqp.Channel, queueName: string) {
    ch.assertQueue(queueName, {
      durable: true
    });
    logger.info('executing webhook database management queue');
    ch.consume(queueName, async (msg: any) => {
      try {
        console.log('queue started consuming ' + queueName);
        // loading json data from the queue and converting it into json format
        const queueData = JSON.parse(msg.content.toString());
        // validating queue data
        const reqObject = QueueDataSchema.validate(queueData);
        if (reqObject.error) {
          throw reqObject.error;
        } else {
          await queueReceivedMessageHandler.processRecieverQueueData(reqObject.value);
        }
      } catch (err: any) {
        const count = msg.properties.headers && msg.properties.headers['x-retries'] || 0;
        if (count < 3) {
          console.log('consume webhook queue retry count ' + count);
          let retry_delay = 3000 * (count + 1);
          const opts = { headers: { 'x-retries': count + 1, 'x-delay': retry_delay } };
          ch.publish(process.env.RABBITQUEUE_RETRY_EXCHANGE_NAME as string, queueName, Buffer.from(msg.content.toString()), opts);
        } else {
          const errMes = JSON.parse(msg.content.toString());
          errorlogService.prepareAndSendErrorQueueData(EntityType.errorLogging, OperationType.create, errMes, err);
          logger.error(err.message);
        }
      }
      // ack message after processing
      ch.ack(msg);
    }, {
      noAck: false
    });
  }
}
