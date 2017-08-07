"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
var DefaultDeepForm = (function () {
    function DefaultDeepForm(storage, validator, initialState) {
        var _this = this;
        this.storage = storage;
        this.validator = validator;
        this.initialState = initialState;
        this.reset = function () { return __awaiter(_this, void 0, void 0, function () {
            var state, _a, fields, _i, _b, key;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!this.initialState) return [3 /*break*/, 5];
                        if (!(typeof this.initialState === 'function')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.initialState()];
                    case 1:
                        _a = _c.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = this.initialState;
                        _c.label = 3;
                    case 3:
                        state = _a;
                        fields = {};
                        for (_i = 0, _b = Object.keys(state); _i < _b.length; _i++) {
                            key = _b[_i];
                            fields[key] = { value: state[key], touched: false };
                        }
                        return [4 /*yield*/, this.storage.setIn()({
                                fields: fields
                            })];
                    case 4: return [2 /*return*/, _c.sent()];
                    case 5: return [4 /*yield*/, this.storage.setIn()({})];
                    case 6: return [2 /*return*/, _c.sent()];
                }
            });
        }); };
        this.changeField = function (fieldChange) { return __awaiter(_this, void 0, void 0, function () {
            var result_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, , 7, 9]);
                        return [4 /*yield*/, this.storage.update(function (prevState) {
                                var fields = __assign({}, prevState.fields);
                                if (fields[fieldChange.name]) {
                                    fields[fieldChange.name] = __assign({}, fields[fieldChange.name], { value: fieldChange.value });
                                }
                                else {
                                    fields[fieldChange.name] = { value: fieldChange.value, touched: false };
                                }
                                return __assign({}, prevState, { fields: fields, validating: true, pristine: false });
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.validator.validate(this, fieldChange)];
                    case 2:
                        result_1 = _a.sent();
                        if (!((result_1.globalErrors
                            && result_1.globalErrors.length > 0)
                            || (result_1.errors && Object.keys(result_1.errors).length > 0))) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.storage.update(function (prevState) {
                                var fields = __assign({}, prevState.fields);
                                for (var _i = 0, _a = Object.keys(fields); _i < _a.length; _i++) {
                                    var key = _a[_i];
                                    if (result_1.errors && result_1.errors[key]) {
                                        fields[key] = __assign({}, fields[key], { error: result_1.errors[key], valid: false });
                                    }
                                    else {
                                        fields[key] = __assign({}, fields[key], { error: undefined, valid: true });
                                    }
                                }
                                return __assign({}, prevState, { fields: fields, valid: false, globalErrors: result_1.globalErrors });
                            })];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.storage.update(function (prevState) {
                            var fields = __assign({}, prevState.fields);
                            for (var _i = 0, _a = Object.keys(fields); _i < _a.length; _i++) {
                                var key = _a[_i];
                                fields[key] = __assign({}, fields[key], { error: undefined, valid: true });
                            }
                            return __assign({}, prevState, { fields: fields, valid: true });
                        })];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [3 /*break*/, 9];
                    case 7: return [4 /*yield*/, this.storage.setIn('validating')(false)];
                    case 8:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/];
                }
            });
        }); };
        this.changeEvent = function (event) { return __awaiter(_this, void 0, void 0, function () {
            var _a, name, value;
            return __generator(this, function (_b) {
                _a = event.currentTarget, name = _a.name, value = _a.value;
                return [2 /*return*/, this.changeField({
                        name: name, value: value
                    })];
            });
        }); };
        this.blurEvent = function (event) { return __awaiter(_this, void 0, void 0, function () {
            var name;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        name = event.currentTarget.name;
                        return [4 /*yield*/, this.storage.updateProperty('fields', function (fields) {
                                var newFields = __assign({}, fields);
                                if (newFields[name]) {
                                    newFields[name] = __assign({}, newFields[name], { touched: true });
                                }
                                else {
                                    newFields[name] = { touched: false, value: '' };
                                }
                                return newFields;
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
    }
    Object.defineProperty(DefaultDeepForm.prototype, "globalErrors", {
        get: function () { return this.storage.state.globalErrors; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultDeepForm.prototype, "fields", {
        get: function () { return this.storage.state.fields || {}; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultDeepForm.prototype, "validating", {
        get: function () { return this.storage.state.validating; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultDeepForm.prototype, "pristine", {
        get: function () { return this.storage.state.pristine; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultDeepForm.prototype, "valid", {
        get: function () { return this.storage.state.valid; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultDeepForm.prototype, "form", {
        get: function () { return this.storage.state; },
        enumerable: true,
        configurable: true
    });
    DefaultDeepForm.prototype.data = function () {
        var fields = this.storage.stateIn('fields');
        var result = {};
        for (var _i = 0, _a = Object.keys(fields); _i < _a.length; _i++) {
            var key = _a[_i];
            result[key] = fields[key].value;
        }
        return result;
    };
    return DefaultDeepForm;
}());
exports.DefaultDeepForm = DefaultDeepForm;
function deepForm(storage, validator, initialState) {
    return new DefaultDeepForm(storage, validator, initialState);
}
exports.deepForm = deepForm;
exports.default = deepForm;
//# sourceMappingURL=forms.js.map