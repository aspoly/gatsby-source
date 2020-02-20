"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("colors")); // eslint-disable-line
// Added so the 'Colors' import doesn't get removed for not being referenced.
colors_1.default.black;
exports.log = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info: (msg, ...args) => console.log('info'.cyan, 'directus'.blue, msg, ...args),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    warn: (msg, ...args) => console.log('warning'.yellow, 'directus'.blue, msg, ...args),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: (msg, ...args) => console.error('error'.red, 'directus'.blue, msg, ...args),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    success: (msg, ...args) => console.log('success'.green, 'directus'.blue, msg, ...args),
};
