"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonBuilder = void 0;
/**
 * @deprecated Will not work on most devices.
 */
class ButtonBuilder {
    constructor(opts) {
        this.buttonId = (opts === null || opts === void 0 ? void 0 : opts.buttonId) || null;
        this.buttonText = { displayText: (opts === null || opts === void 0 ? void 0 : opts.displayText) || null };
        this.type = (opts === null || opts === void 0 ? void 0 : opts.type) || 1;
    }
    setId(id) {
        if (!id)
            throw new Error('[ckptw] button builder need id');
        this.buttonId = id;
        return this;
    }
    setDisplayText(text) {
        if (!text)
            throw new Error("[ckptw] button builder need display text");
        this.buttonText.displayText = text;
        return this;
    }
    setType(type = 1) {
        this.type = type;
        return this;
    }
}
exports.ButtonBuilder = ButtonBuilder;
