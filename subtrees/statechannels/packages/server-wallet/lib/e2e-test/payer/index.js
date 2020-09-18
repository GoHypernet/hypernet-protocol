"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = __importStar(require("yargs"));
const start_1 = __importDefault(require("./start"));
yargs
    .scriptName('payer')
    .command(start_1.default)
    .demandCommand(1, 'Choose a command from the above list')
    .help().argv;
//# sourceMappingURL=index.js.map