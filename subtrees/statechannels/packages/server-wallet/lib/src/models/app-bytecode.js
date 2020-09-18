"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
class AppBytecode extends objection_1.Model {
    static get idColumn() {
        return ['chain_id', 'app_definition'];
    }
    static async getBytecode(chainId, appDefinition, txOrKnex) {
        var _a;
        return (_a = (await AppBytecode.query(txOrKnex)
            .where({ chainId, appDefinition })
            .first())) === null || _a === void 0 ? void 0 : _a.appBytecode;
    }
}
exports.AppBytecode = AppBytecode;
AppBytecode.tableName = 'app_bytecode';
//# sourceMappingURL=app-bytecode.js.map