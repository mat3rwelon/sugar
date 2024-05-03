"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Functions_1 = require("../Common/Functions");
const Ctx_1 = require("../Classes/Ctx");
module.exports = (self) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    let { cmd, prefix, m } = self;
    if (!m || !m.message || (m.key && m.key.remoteJid === "status@broadcast"))
        return;
    const hasHears = Array.from(self.hearsMap.values()).filter((x) => (x.name === m.content) || (x.name === m.messageType) || (new RegExp(x.name).test(m.content)) || (Array.isArray(x.name) ? x.name.includes(m.content) : false));
    if (hasHears.length)
        return hasHears.map((x) => {
            if (cond(self)) {
                try{
                x.code(new Ctx_1.Ctx({ used: { hears: m.content }, args: [], self, client: self.core }))
                }catch(e){logg(e)}
            } else {
                logg(`Failed to hears: ${m.content}`)
            }
        });
    let allCommandsValue = Array.from(cmd === null || cmd === void 0 ? void 0 : cmd.values());
    let args;
    let command;
    let selectedPrefix;
    if (Array.isArray(prefix)) {
        if (prefix[0] == "") {
            const emptyIndex = prefix.indexOf(prefix.filter((x) => x.includes("")).join(""));
            prefix = (0, Functions_1.arrayMove)(prefix, emptyIndex - 1, prefix.length - 1);
        }
        else {
            selectedPrefix = prefix.find((p) => { var _a; return (_a = m.content) === null || _a === void 0 ? void 0 : _a.startsWith(p); });
        }
    }
    else if (prefix instanceof RegExp) {
        if (prefix.test(m.content)) {
            let match = (_a = m.content) === null || _a === void 0 ? void 0 : _a.match(prefix);
            if (match)
                selectedPrefix = match[0];
        }
    }
    if (!selectedPrefix)
        return;
    args = (_b = m.content) === null || _b === void 0 ? void 0 : _b.slice(selectedPrefix.length).trim().split(/ +/g);
    command = (_c = args === null || args === void 0 ? void 0 : args.shift()) === null || _c === void 0 ? void 0 : _c.toLowerCase();
    const commandDetail = allCommandsValue.filter((c) => c.name.toLowerCase() === command.toLowerCase() ||
        (c.aliases && typeof c.aliases === "object"
            ? c.aliases.includes(command.toLowerCase())
            : c.aliases === command.toLowerCase()));
    if (commandDetail.length)
        commandDetail.map((x) => {
            if (cond(self)) {
                try{
                x.code(new Ctx_1.Ctx({ used: { prefix: selectedPrefix, command }, args, self, client: self.core }))
                }catch(e){logg(e)}
            } else {
                logg(`Failed to handle cmd: ${selectedPrefix + command}`)
            }
        });
});
