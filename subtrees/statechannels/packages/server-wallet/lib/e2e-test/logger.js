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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const pino_1 = __importDefault(require("pino"));
const ARTIFACTS_DIR = '../../artifacts';
if (!fs.existsSync(ARTIFACTS_DIR)) {
    fs.mkdirSync(ARTIFACTS_DIR);
}
const destination = pino_1.default.destination(path.join(ARTIFACTS_DIR, 'e2e.log'));
exports.logger = pino_1.default({}, destination);
//# sourceMappingURL=logger.js.map