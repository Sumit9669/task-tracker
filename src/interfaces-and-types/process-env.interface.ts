export {};
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
      AXIOS_TIMEOUT: string;
      SERVICE_CODE: string;
    }
  }
}
