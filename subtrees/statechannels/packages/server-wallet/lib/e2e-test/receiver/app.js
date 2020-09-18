"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const express_pino_logger_1 = __importDefault(require("express-pino-logger"));
const logger_1 = require("../logger");
const controller_1 = __importDefault(require("./controller"));
const controller = new controller_1.default();
const app = express_1.default();
app.use(express_pino_logger_1.default({ logger: logger_1.logger }));
app.post('/status', (_req, res) => res.status(200).send('OK'));
app.get('/participant', (_req, res) => res
    .status(200)
    .contentType('application/json')
    .send(controller.participantInfo));
app.post('/inbox', body_parser_1.default.json(), async (req, res) => res
    .status(200)
    .contentType('application/json')
    .send(await controller.acceptMessageAndReturnReplies(req.body.message)));
exports.default = app;
//# sourceMappingURL=app.js.map