"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noAction = undefined;
const actionConstructor = (type) => (props) => ({ ...props, type });
exports.submitTransaction = actionConstructor('SubmitTransaction');
exports.notifyApp = actionConstructor('NotifyApp');
exports.signState = actionConstructor('SignState');
const guard = (type) => (a) => a.type === type;
exports.isSignState = guard('SignState');
exports.isNotifyApp = guard('NotifyApp');
exports.isSubmitTransaction = guard('SubmitTransaction');
exports.isOutgoing = exports.isNotifyApp;
//# sourceMappingURL=actions.js.map