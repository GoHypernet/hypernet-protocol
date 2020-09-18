"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pino_1 = __importDefault(require("pino"));
class BaseError extends Error {
    constructor(reason, data = undefined) {
        super(reason);
        this.data = data;
        this.context = data;
    }
    static isKnownErr(errorMessage, knownErrors) {
        const idx = knownErrors.findIndex(known => errorMessage.includes(known));
        return idx !== -1;
    }
}
exports.BaseError = BaseError;
BaseError.errors = {
    OnchainError: 'OnchainError',
    TransactionError: 'TransactionError',
    StorageError: 'StorageError',
};
exports.addEvtHandler = (evt, callback, filter, timeout) => {
    const attachArgs = [filter, timeout, callback].filter(x => !!x);
    return evt.attach(...attachArgs);
};
exports.logger = pino_1.default();
function isFundingEvent(e) {
    var _a, _b, _c, _d, _e, _f;
    if (!((_a = e) === null || _a === void 0 ? void 0 : _a.transactionHash))
        return false;
    if (!((_b = e) === null || _b === void 0 ? void 0 : _b.blockNumber))
        return false;
    if (!((_c = e) === null || _c === void 0 ? void 0 : _c.channelId))
        return false;
    if (!((_d = e) === null || _d === void 0 ? void 0 : _d.amount))
        return false;
    if (!((_e = e) === null || _e === void 0 ? void 0 : _e.type))
        return false;
    if (typeof ((_f = e) === null || _f === void 0 ? void 0 : _f.final) !== 'boolean')
        return false;
    return true;
}
exports.isFundingEvent = isFundingEvent;
//# sourceMappingURL=utils.js.map