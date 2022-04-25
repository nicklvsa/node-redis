"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CRLF = '\r\n';
function encodeCommand(args) {
    const toWrite = [];
    let strings = `*${args.length}${CRLF}`;
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (typeof arg === 'string') {
            const byteLength = Buffer.byteLength(arg);
            strings += `$${byteLength}${CRLF}`;
            strings += arg;
        }
        else if (arg instanceof Buffer) {
            toWrite.push(`${strings}$${arg.length}${CRLF}`);
            strings = '';
            toWrite.push(arg);
        }
        else {
            throw new TypeError('Invalid argument type');
        }
        strings += CRLF;
    }
    toWrite.push(strings);
    return toWrite;
}
exports.default = encodeCommand;
