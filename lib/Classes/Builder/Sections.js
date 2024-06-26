"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectionsBuilder = void 0;
/**
 * @deprecated Will not work on most devices.
 */
class SectionsBuilder {
    constructor(opts) {
        this.title = (opts === null || opts === void 0 ? void 0 : opts.title) || null;
        this.rows = (opts === null || opts === void 0 ? void 0 : opts.rows) || [];
    }
    setTitle(title) {
        if (!title)
            throw new Error('[ckptw] section builder need title');
        this.title = title;
        return this;
    }
    setRows(...row) {
        if (!row)
            throw new Error("[ckptw] button builder need rows");
        this.rows = row;
        return this;
    }
}
exports.SectionsBuilder = SectionsBuilder;
