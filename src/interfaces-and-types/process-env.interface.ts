export { };
declare global {
    namespace NodeJS {
        export interface ProcessEnv {
            NODE_ENV: string;
            PORT: string;
            HOST: string;
            DB_USER: string;
            DB_PASS: string;
            DB_HOST: string;
            DB_PORT: string;
            RABBITQUEUE_URL: string;
            RABBITQUEUE_USER_NAME: string;
            RABBITQUEUE_USER_PASS: string;
            AXIOS_TIMEOUT: string;
            SERVICE_CODE: string;
            MAIL_QUEUE: string;
            RECIEVER_EMAIL: string;
            SMAI_ERROR_QUEUE: string;
            NOSQL_DB_USER: string;
            NOSQL_DB_PASS: string;
            NOSQL_DB_HOST: string;
            NOSQL_DB_PORT: string;
        }
    }
}
