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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageEventList = exports.emitReaction = exports.emitPollUpdate = exports.emitPollCreation = void 0;
const Ctx_1 = require("../Classes/Ctx");
const Events_1 = require("../Constant/Events");
const MessageType_1 = require("../Constant/MessageType");
const emitPollCreation = (m, ev, self, core) => __awaiter(void 0, void 0, void 0, function* () {
    m.content = m.message.pollCreationMessage.name;
    m.pollValues = m.message.pollCreationMessage.options.map((x) => x.optionName);
    m.pollSingleSelect = Boolean(m.message.pollCreationMessage.selectableOptionsCount);
    ev === null || ev === void 0 ? void 0 : ev.emit(Events_1.Events.Poll, m, new Ctx_1.Ctx({ used: { poll: m.content }, args: [], self: self, client: core }));
});
exports.emitPollCreation = emitPollCreation;
const emitPollUpdate = (m, ev, self, core) => __awaiter(void 0, void 0, void 0, function* () {
    ev === null || ev === void 0 ? void 0 : ev.emit(Events_1.Events.PollVote, m, new Ctx_1.Ctx({ used: { pollVote: m.content }, args: [], self: self, client: core }));
});
exports.emitPollUpdate = emitPollUpdate;
const emitReaction = (m, ev, self, core) => __awaiter(void 0, void 0, void 0, function* () {
    ev.emit(Events_1.Events.Reactions, m, new Ctx_1.Ctx({ used: { reactions: m.content }, args: [], self: self, client: core }));
});
exports.emitReaction = emitReaction;
exports.MessageEventList = {
    [MessageType_1.MessageType.pollCreationMessage]: exports.emitPollCreation,
    [MessageType_1.MessageType.pollUpdateMessage]: exports.emitPollUpdate,
    [MessageType_1.MessageType.reactionMessage]: exports.emitReaction,
};
