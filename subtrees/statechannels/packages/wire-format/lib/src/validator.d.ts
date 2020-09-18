import Ajv = require('ajv');
import { Message, SignedState } from './types';
export declare const messageIsValid: Ajv.ValidateFunction;
export declare function validateMessage(jsonBlob: object): Message;
export declare const stateIsValid: Ajv.ValidateFunction;
export declare function validateState(jsonBlob: object): SignedState;
//# sourceMappingURL=validator.d.ts.map