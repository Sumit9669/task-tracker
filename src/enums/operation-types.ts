export enum OperationType {
    create = 'CREATE',
    update = 'UPDATE',
    delete = 'DELETE',
    replace = 'REPLACE',
    void = 'VOID',
    calculation = 'CALCULATION'
}
export enum StatusType {
    true=1,
    false=0
}
export enum errorType {
    QueueBasedError = 1,
    ServiceBasedError = 2
}