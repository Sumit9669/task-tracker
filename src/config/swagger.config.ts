/**
 * Swagger Configuration
 */
export const SwaggerConfig = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Web APIs for Task Tracker",
      version: "1.0.0",
      description: "List of APIs for Banking Service",
      // license: {
      //     name: 'Licensed Under MIT',
      //     url: 'https://spdx.org/licenses/MIT.html',
      // },
      contact: {
        name: "Smansha-AI",
        // url: 'https://jsonplaceholder.typicode.com',
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "localhost server",
      },
    ],
  },
  // apis: ['src/api/routes/*.ts'],
  apis: [
    "src/api/routes/*.ts",
    "src/api/swagger/*.ts",
    "src/api/swagger/models/*.ts",
    "src/api/routes/*/**.ts",
  ],
};
