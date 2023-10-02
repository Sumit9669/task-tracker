const dotenv = require('dotenv');
const os=  require('os');
console.log("env:--> " + process.env.NODE_ENV);
const homeDir = os.homedir();
const configPath = `./env/development.env`;
// Set the env file
const config = dotenv.config({
    path: configPath,
});
// Set the env file
// const config = dotenv.config({
//     path: configPath,
// });

if (config.error) {
    console.log("CONFIG READ FAILED FROM PATH:- " + configPath);
    throw config.error;
}
else {
    console.log("CONFIG READ SUCCESS FROM PATH:- " + configPath);
}

module.exports = [{
    name: "default",
    type: "mysql",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'migration_default',
    synchronize: false,
    logging: false,
    entities: [`${__dirname}/entity/**/*{.js,.ts}`],
    migrations: [`${__dirname}/migration/**/*{.js,.ts}`],
    subscribers: [`${__dirname}/subscriber/**/*{.js,.ts}`],
    cli: {
        entitiesDir: "src/entitites",
        migrationsDir: "src/migration",
        subscribersDir: "src/subscriber",
    },
}]