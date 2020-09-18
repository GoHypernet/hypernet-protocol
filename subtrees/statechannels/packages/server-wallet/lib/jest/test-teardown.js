"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function teardown() {
    await global.__GANACHE_SERVER__.close();
}
exports.default = teardown;
//# sourceMappingURL=test-teardown.js.map