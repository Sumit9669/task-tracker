import dotenv from "dotenv";
import commandLineArgs from "command-line-args";
import os from "os";

// Setup command line options
const options = commandLineArgs([
  {
    name: "env",
    alias: "e",
    defaultValue: "development",
    type: String,
  },
]);

const homeDir = os.homedir();
// Set the env file
const config = dotenv.config({
  path: `./env/${options.env}.env`,
});

if (config.error) {
  throw config.error;
}

export default config;
