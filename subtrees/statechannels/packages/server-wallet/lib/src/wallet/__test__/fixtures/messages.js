"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const states_1 = require("./states");
const emptyMessage = {};
exports.message = (props) => {
    const defaults = lodash_1.default.cloneDeep(emptyMessage);
    return lodash_1.default.merge(defaults, props);
};
function messageWithState(props) {
    const defaults = lodash_1.default.merge(emptyMessage, { signedStates: [states_1.createState()] });
    return lodash_1.default.merge(defaults, props);
}
exports.messageWithState = messageWithState;
//# sourceMappingURL=messages.js.map