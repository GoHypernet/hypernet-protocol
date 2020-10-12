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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var debug_1 = __importDefault(require("debug"));
var log = debug_1.default('channel-provider:ui');
var UIElementNames;
(function (UIElementNames) {
    UIElementNames["Styles"] = "channelProviderUiStyles";
    UIElementNames["Container"] = "channelProviderUiContainer";
    UIElementNames["IFrame"] = "channelProviderUi";
})(UIElementNames = exports.UIElementNames || (exports.UIElementNames = {}));
// TODO: Border radius shouldn't be set here it should be set in the wallet
exports.cssStyles = "iframe#" + UIElementNames.IFrame + " {\n  border: 0;\n  position: fixed;\n  left: 0;\n  right: 0;\n  margin-left: auto;\n  margin-right: auto;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  margin-top: 0;\n  overflow: hidden;\n  z-index: 1301;\n}\ndiv#" + UIElementNames.Container + " {\n  position: absolute;\n  left: 0px;\n  top: 0px;\n  width: 100%;\n  height: 100%;\n  background: rgba(0, 0, 0, 0.32);\n  z-index: 1300;\n}\n.hide {\n  display:none;\n}\n";
var IFrameService = /** @class */ (function () {
    function IFrameService() {
        this.url = '';
    }
    Object.defineProperty(IFrameService.prototype, "container", {
        get: function () {
            return document.querySelector("#" + UIElementNames.Container);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IFrameService.prototype, "iframe", {
        get: function () {
            return document.querySelector("#" + UIElementNames.IFrame);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IFrameService.prototype, "styles", {
        get: function () {
            return document.querySelector("#" + UIElementNames.Styles);
        },
        enumerable: true,
        configurable: true
    });
    IFrameService.prototype.setUrl = function (url) {
        this.url = url;
    };
    IFrameService.prototype.mount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        if (_this.iframe) {
                            resolve();
                            return;
                        }
                        var iframe = document.createElement('iframe');
                        var style = document.createElement('style');
                        var container = document.createElement('div');
                        style.id = UIElementNames.Styles;
                        style.innerHTML = exports.cssStyles;
                        container.id = UIElementNames.Container;
                        iframe.id = UIElementNames.IFrame;
                        iframe.src = _this.url;
                        iframe.onload = function () {
                            resolve();
                        };
                        container.appendChild(iframe);
                        document.head.appendChild(style);
                        document.body.appendChild(container);
                        _this.setVisibility(false);
                    })];
            });
        });
    };
    IFrameService.prototype.unmount = function () {
        if (this.iframe) {
            this.iframe.remove();
            log('UI IFrame removed');
        }
        if (this.container) {
            this.container.remove();
            log('UI Container removed');
        }
        if (this.styles) {
            this.styles.remove();
            log('UI Styles removed');
        }
    };
    IFrameService.prototype.setVisibility = function (visible) {
        if (!this.container) {
            throw new Error('Cannot find the wallet iFrame container.');
        }
        this.container.classList.toggle('hide', !visible);
    };
    IFrameService.prototype.getTarget = function () {
        return __awaiter(this, void 0, void 0, function () {
            var iframe;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.iframe) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.mount()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        iframe = this.iframe;
                        return [2 /*return*/, iframe.contentWindow];
                }
            });
        });
    };
    return IFrameService;
}());
exports.IFrameService = IFrameService;
//# sourceMappingURL=iframe-service.js.map