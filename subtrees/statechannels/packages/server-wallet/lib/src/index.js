"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wallet_1 = require("./wallet");
exports.Wallet = wallet_1.Wallet;
const db_admin_connection_1 = __importDefault(require("./db-admin/db-admin-connection"));
exports.WalletKnex = db_admin_connection_1.default;
//# sourceMappingURL=index.js.map