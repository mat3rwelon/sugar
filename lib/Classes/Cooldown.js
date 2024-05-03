"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cooldown = void 0;
const Functions_1 = require("../Common/Functions");
const events_1 = __importDefault(require("events"));
class Cooldown extends events_1.default {
    constructor(ctx, ms) {
        var _a, _b;
        super();
        this.ms = ms;
        this.cooldown = ctx._self.cooldown;
        this.timeout = 0;
        let q = `cooldown_${ctx._used.command}_${(0, Functions_1.decodeJid)(ctx._msg.key.remoteJid)}_${(0, Functions_1.decodeJid)(ctx._sender.jid)}`;
        const get = (_a = this.cooldown) === null || _a === void 0 ? void 0 : _a.get(q);
        if (get) {
            this.timeout = Number(get) - Date.now();
        }
        else {
            (_b = this.cooldown) === null || _b === void 0 ? void 0 : _b.set(q, Date.now() + ms);
            setTimeout(() => {
                var _a;
                (_a = this.cooldown) === null || _a === void 0 ? void 0 : _a.delete(q);
                this.emit("end");
            }, ms);
        }
    }
    get onCooldown() {
        return this.timeout ? true : false;
    }
    get timeleft() {
        return this.timeout;
    }
}
exports.Cooldown = Cooldown;
