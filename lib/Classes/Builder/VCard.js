"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VCardBuilder = void 0;
class VCardBuilder {
    constructor(opts) {
        this.fullName = (opts === null || opts === void 0 ? void 0 : opts.fullName) || null;
        this.org = (opts === null || opts === void 0 ? void 0 : opts.org) || null;
        this.number = (opts === null || opts === void 0 ? void 0 : opts.number) || null;
    }
    setFullName(fullName) {
        if (!fullName)
            throw new Error('[ckptw] vcard builder need full name');
        this.fullName = fullName;
        return this;
    }
    setOrg(organizationName) {
        if (!organizationName)
            throw new Error("[ckptw] vcard builder need organization name");
        this.org = organizationName;
        return this;
    }
    setNumber(number) {
        if (!number)
            throw new Error('[ckptw] vcard builder need number');
        this.number = number;
        return this;
    }
    build() {
        var _a;
        return 'BEGIN:VCARD\n'
            + 'VERSION:3.0\n'
            + `FN:${this.fullName}\n`
            + `ORG:${this.org};\n`
            + `TEL;type=CELL;type=VOICE;waid=${(_a = this.number) === null || _a === void 0 ? void 0 : _a.replace(/\s/g, '')}:+${this.number}\n`
            + 'END:VCARD';
    }
}
exports.VCardBuilder = VCardBuilder;
