"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageCollector = void 0;
const Functions_1 = require("../../Common/Functions");
const Events_1 = require("../../Constant/Events");
const Collector_1 = require("./Collector");
class MessageCollector extends Collector_1.Collector {
    constructor(clientReq, options = {
        filter: function (args, collector) {
            throw new Error("Function not implemented.");
        },
        time: 0,
        max: 0,
        maxProcessed: 0
    }) {
        super(options);
        this.clientReq = clientReq;
        this.jid = this.clientReq.msg.key.remoteJid;
        this.received = 0;
        this.clientReq.self.ev.on(Events_1.Events.MessagesUpsert, this.collect);
        this.once('end', () => {
            this.removeListener(Events_1.Events.MessagesUpsert, this.collect);
        });
        return this;
    }
    _collect(msg) {
        let content = (0, Functions_1.getContentFromMsg)(msg);
        if (!msg.key.fromMe && this.jid === msg.key.remoteJid && (content === null || content === void 0 ? void 0 : content.length)) {
            this.received++;
            return Object.assign(Object.assign({}, msg), { jid: msg.key.remoteJid, sender: (0, Functions_1.getSender)(msg, this.clientReq.self.core), content });
        }
        else {
            return null;
        }
    }
}
exports.MessageCollector = MessageCollector;
