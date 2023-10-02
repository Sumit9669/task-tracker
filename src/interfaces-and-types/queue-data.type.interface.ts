/**
 * Interface defined for queue data
 */
export interface MQueueData {
    metadata: {
        entity: string // "INVOICE" , "CONTACT", "JV"
        operation: string // "CREATE", "UPDATE"
        source: string  // "smai-qb-service"
        destination: string // "smai-business-service"
        timestamp: string // "2020-04-29T03:54:41.578Z"
        businessId: string // "d91863dc-391d-4d60-a6f4-3300c75b180a"
        query?: string,
        reloadType?: number,
        monthlyReloadDate?: string,
        instituteId: string,
        bankAccountId? : string
    };
    data: any;
}

export interface BalanceTypes {
        available: number,
        accessible: number
}
