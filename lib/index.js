"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
function isUsesDeepStorage(value) {
    return value.storage !== undefined;
}
function getStorage(value) {
    if (isUsesDeepStorage(value)) {
        return value.storage;
    }
    else {
        return value;
    }
}
exports.deep = function (deepProps, ownProps) { return function (BaseComponent) {
    var keys = Object.keys(deepProps);
    if (keys.length === 0)
        throw 'No deep properties specified';
    var rootStorage = getStorage(deepProps[keys[0]]).root();
    var parsedPaths = {};
    // go through each of the storages... we're going to assume for now that
    // they all have the same root
    for (var _i = 0, _a = Object.keys(deepProps); _i < _a.length; _i++) {
        var key = _a[_i];
        parsedPaths[key] = getStorage(deepProps[key]).path;
    }
    return (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.componentDidMount = function () {
            var _this = this;
            this.subscription = rootStorage.subscription(function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                _this.forceUpdate();
            });
            for (var key in deepProps) {
                (_a = this.subscription).subscribeTo.apply(_a, parsedPaths[key]);
            }
            var _a;
        };
        class_1.prototype.componentWillUnmount = function () {
            this.subscription && this.subscription.cancel();
        };
        class_1.prototype.shouldComponentUpdate = function (nextProps, nextState) {
            var nextPropsAny = nextProps;
            for (var key in parsedPaths) {
                if (nextPropsAny[key] !== rootStorage.stateIn.apply(rootStorage, parsedPaths[key])) {
                    return true;
                }
            }
            return false;
        };
        class_1.prototype.render = function () {
            var anyProps = this.props;
            var newProps = __assign({}, anyProps, (ownProps || {}));
            for (var key in parsedPaths) {
                var value = deepProps[key];
                if (isUsesDeepStorage(value)) {
                    newProps[key] = value;
                }
                else {
                    newProps[key] = value.state;
                }
            }
            return React.createElement(BaseComponent, __assign({}, newProps));
        };
        return class_1;
    }(React.Component));
}; };
//# sourceMappingURL=index.js.map