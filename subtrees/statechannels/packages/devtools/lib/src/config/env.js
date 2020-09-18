"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function getEnvBool(name, throwIfMissing = true) {
    const val = process.env[name];
    if (throwIfMissing && val === undefined) {
        throw Error(`Environment variable ${name} is not set.`);
    }
    switch (process.env[name]) {
        case undefined:
        case null:
        case 'null':
        case 'false':
        case 'FALSE':
        case '0':
            return false;
        default:
            return true;
    }
}
exports.getEnvBool = getEnvBool;
function configureEnvVariables() {
    const scEnvFilesDirectory = process.env.MONOREPO_ROOT || '../..';
    const SC_ENV = process.env.SC_ENV;
    if (SC_ENV) {
        const scEnvFile = path.join(scEnvFilesDirectory, '.env.' + SC_ENV);
        const scEnvFileFullPath = path.join(process.cwd(), scEnvFile);
        if (!fs.existsSync(scEnvFileFullPath)) {
            throw new Error(`${scEnvFileFullPath} must exist in the monorepo root`);
        }
        const result = require('dotenv-expand')(require('dotenv').config({
            path: scEnvFile
        }));
        console.log('The following env vars were loaded to process.env:');
        console.log(result);
        return;
    }
    if (!process.env.NODE_ENV) {
        console.warn('[@statechannels/devtools] NODE_ENV is undefined — setting to "development"');
        process.env.NODE_ENV = 'development';
    }
    const NODE_ENV = process.env.NODE_ENV;
    let dotenvFiles = ['.env'];
    if (NODE_ENV)
        dotenvFiles = dotenvFiles.concat([`.env.${NODE_ENV}.local`, `.env.${NODE_ENV}`]);
    if (NODE_ENV && NODE_ENV !== 'test')
        dotenvFiles.push('.env.local');
    const monorepoDotenvFiles = dotenvFiles.slice(0);
    dotenvFiles.forEach((dotenvFile) => {
        monorepoDotenvFiles.push(path.join('../..', dotenvFile));
    });
    dotenvFiles = monorepoDotenvFiles;
    dotenvFiles.forEach((dotenvFile) => {
        if (fs.existsSync(dotenvFile)) {
            require('dotenv-expand')(require('dotenv').config({
                path: dotenvFile
            }));
        }
    });
}
exports.configureEnvVariables = configureEnvVariables;
//# sourceMappingURL=env.js.map