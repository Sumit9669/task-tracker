/**
 * Interface defined for queue data
 */
export interface MQueueMailData {
    metadata: {
        source: string  // "smai-qb-service"
        destination: string // "smai-business-service"
        timestamp: string // "2020-04-29T03:54:41.578Z"
        businessId?: string // "d91863dc-391d-4d60-a6f4-3300c75b180a"
        emailType: string
        receiver: any
    };
    data: any;
}
