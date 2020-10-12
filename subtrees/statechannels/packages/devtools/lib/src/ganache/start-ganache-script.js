#! /usr/local/bin/node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const env_1 = require("../config/env");
const _1 = require(".");
env_1.configureEnvVariables();
void (() => __awaiter(void 0, void 0, void 0, function* () {
    const cacheFolder = process.env.GANACHE_CACHE_FOLDER;
    const port = Number(process.env.GANACHE_PORT || 8545);
    if (!cacheFolder) {
        throw Error('Must set a GANACHE_CACHE_FOLDER in env to start a shared ganache instance');
    }
    const deploymentsFile = path.join(process.cwd(), cacheFolder, `ganache-deployments-${port}.json`);
    yield _1.startSharedGanache(deploymentsFile, { port });
}))();
//# sourceMappingURL=start-ganache-script.js.map