"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateButtonsBuilder = void 0;
/**
 * @deprecated Will not work on most devices.
 */
class TemplateButtonsBuilder {
    constructor(opts) {
        this.array = (opts === null || opts === void 0 ? void 0 : opts.array) || [];
        this.index = 0;
    }
    addURL(opts) {
        if (!opts.displayText || !opts.url)
            throw new Error('[ckptw] template button builder need url display text or url');
        let index = this.index + 1;
        this.array.push({ index, urlButton: Object.assign({}, opts) });
        this.index = index;
        return this;
    }
    addCall(opts) {
        if (!opts.displayText || !opts.phoneNumber)
            throw new Error("[ckptw] template button builder need call display text or phone number");
        let index = this.index + 1;
        this.array.push({ index, callButton: Object.assign({}, opts) });
        this.index = index;
        return this;
    }
    addQuickReply(opts) {
        if (!opts.displayText || !opts.id)
            throw new Error("[ckptw] template button builder need quick reply display text or id");
        let index = this.index + 1;
        this.array.push({ index, quickReplyButton: Object.assign({}, opts) });
        this.index = index;
        return this;
    }
    build() {
        return this.array;
    }
}
exports.TemplateButtonsBuilder = TemplateButtonsBuilder;
