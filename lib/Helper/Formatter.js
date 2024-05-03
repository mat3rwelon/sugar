"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inlineCode = exports.monospace = exports.quote = exports.strikethrough = exports.italic = exports.bold = void 0;
const bold = (str) => {
    return `*${str}*`;
};
exports.bold = bold;
const italic = (str) => {
    return `_${str}_`;
};
exports.italic = italic;
const strikethrough = (str) => {
    return `~${str}~`;
};
exports.strikethrough = strikethrough;
const quote = (str) => {
    return `> ${str}`;
};
exports.quote = quote;
const monospace = (str) => {
    return `\`\`\`${str}\`\`\``;
};
exports.monospace = monospace;
const inlineCode = (str) => {
    return `\`${str}\``;
};
exports.inlineCode = inlineCode;
