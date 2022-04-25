"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformArguments = void 0;
function transformArguments(code, options) {
    const args = ['FUNCTION', 'LOAD'];
    if (options === null || options === void 0 ? void 0 : options.REPLACE) {
        args.push('REPLACE');
    }
    args.push(code);
    return args;
}
exports.transformArguments = transformArguments;
