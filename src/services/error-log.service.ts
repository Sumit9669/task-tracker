import { CommonFunctions } from '@shared/common-functions';
import { QueueConnector } from '@shared/queue-connector';
import { EntityType } from 'src/enums/common-enums';
import { errorType, OperationType } from 'src/enums/operation-types';
import { QueueErrorLogParser } from 'src/parsers/queue-error-log.parser';
import logger from '@shared/logger';
const commonFunctions = new CommonFunctions();
const queueErrorLogParser = new QueueErrorLogParser();


export class ErrorlogService {

    public async prepareAndSendErrorQueueData(entityType: EntityType, operationType: OperationType, errorlog: any, err: any) {
        const id = commonFunctions.getMongoObjectId();
        const errorData = await queueErrorLogParser.errorLogParser(errorlog, err, id, Number(process.env.DBMS_SERVICE_CODE));
        const queueData =
        {
            metadata:
            {
                entity: entityType,
                operation: operationType,
                timestamp: new Date().toISOString(),
                source: process.env.DBMS_SERVICE_NAME as string,
                destination: process.env.SMAI_ERROR_QUEUE as string,
                businessId: errorlog.data.businessId || null,
                instituteId: errorlog.metadata.instituteId,
                errorType: errorType.QueueBasedError
            },
            data: errorData
        };
        logger.info("Error send to queue  " + JSON.stringify(queueData))
        logger.info("please check with in mongo error db with id " + id);
        QueueConnector.sendMessageToQueue(process.env.SMAI_ERROR_QUEUE, queueData);
        return true;
    }
    public async prepareAndSendErrorServiceData(entityType: EntityType, operationType: OperationType, errorlog: any) {
        const { name, ...errorDetail } = errorlog;
        const instituteId = errorlog.requestObject.headers['instituteid'] as string;
        const queueData =
        {
            metadata:
            {
                entity: entityType,
                operation: operationType,
                timestamp: new Date().toISOString(),
                source: process.env.DBMS_SERVICE_NAME as string,
                destination: process.env.SMAI_ERROR_QUEUE as string,
                businessId: errorlog.businessId || null,
                instituteId,
                errorType: errorType.ServiceBasedError
            },
            data: errorDetail
        };
        QueueConnector.sendMessageToQueue(process.env.SMAI_ERROR_QUEUE, queueData);
        return true;
    }
}
