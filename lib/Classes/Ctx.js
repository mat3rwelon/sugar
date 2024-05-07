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
exports.Ctx = void 0;
const Functions_1 = require("../Common/Functions");
const Simple_1 = require("../Helper/Simple");
const baileys_1 = require("baileys");
const MessageCollector_1 = require("./Collector/MessageCollector");
class Ctx {
    constructor(options) {
        this._used = options.used;
        this._args = options.args;
        this._self = options.self;
        this._client = options.client;
        this._msg = this._self.m;
        this._sender = {
            jid: (0, Functions_1.getSender)(this._msg, this._client),
            pushName: this._msg.pushName,
        };
        this._config = {
            name: this._self.name,
            prefix: this._self.prefix,
            cmd: this._self.cmd,
        };
    }
    get id() {
        return this._msg.key.remoteJid;
    }
    get args() {
        return this._args;
    }
    get msg() {
        return this._msg;
    }
    get sender() {
        return this._sender;
    }
    sendMessage(jid, content, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._client.sendMessage(jid, content, options);
        });
    }
    async sendMsg(text, jid = null, content = {}, options = {}) {
        return this.sendMessage(jid || this.id, { text: text, ...content }, options)
    }
    async sendImage(jid, image, caption = '', content = {}, options = {}) {
        return this.sendMessage(jid, { image: Buffer.isBuffer(image) ? image : await Simple_1.getBuffer(image), caption: caption, ...content }, options)
    }
    async sendVideo(jid, video, caption = '', content = {}, options = {}) {
        return this.sendMessage(jid, { video: Buffer.isBuffer(video) ? video : await Simple_1.getBuffer(video), caption: caption, ...content }, options)
    }
    async sendAudio(jid, audio, vn = false, content = {}, options = {}) {
        return this.sendMessage(jid, {
            audio: Buffer.isBuffer(audio) ? audio : await Simple_1.getBuffer(audio),
            ptt: vn ? true : false,
            ...content
        }, options)
    }
    async sendVoiceNote(jid, audio, content = {}, options = {}) {
        return await this.sendAudio(jid, audio, true, content, options)
    }
    async sendVn(jid, audio, content = {}, options = {}) {
        return await this.sendAudio(jid, audio, true, content, options)
    }
    async sendDocument(jid, file, caption = '', fileName = 'FILE', mimetype = null, content = {}, options = {}) {
        file = Buffer.isBuffer(file) ? file : await Simple_1.getBuffer(file)
        return await this.sendMessage(jid, {
            document: file,
            mimetype: mimetype || (await require('file-type').fromBuffer(file),
            caption: caption,
            fileName: fileName,
            ...content
        }, options)
    }
    async sendDoc(jid, file, caption = '', fileName = 'FILE', mimetype = null, content = {}, options = {}) {
        return await this.sendDocument(jid, file, caption, fileName, mimetype, content, options)
    }
    async sendFile(jid, file, caption = '', content = {}, options = {}) {
        file = Buffer.isBuffer(file) ? file : await Simple_1.getBuffer(file)
        let ftype = require('file-type').fromBuffer(file)
        try {
            let mime = ftype.mime
            if (mime) {
                if (mime.startsWith('video') || mime.endsWith('gif')) {
                    return await this.sendVideo(jid, file, caption, content, options)
                } else if (mime.startsWith('image')) {
                    return await this.sendImage(jid, file, caption, content, options)
                } else if (mime.startsWith('audio')) {
                    let _vn = false
                    if (content.vn) {
                        _vn = true
                        delete content.vn
                    } else if (content.voicenote) {
                        _vn = true
                        delete content.voicenote
                    } else if (content.ptt) {
                        _vn = true
                    }
                    return await this.sendAudio(jid, file, _vn, content, options)
                } else {
                    let _filename = 'FILE'
                    if (content.fileName) {
                        _filename = content.fileName
                        delete content.fileName
                    } else if (content.filename) {
                        _filename = content.filename
                        delete content.filename
                    } else if (content.name) {
                        _filename = content.name
                        delete content.name
                    }
                    return await this.sendDoc(jid, file, caption, _filename, mime, content, options)
                }
            } else {
                throw new Error('Failed to send file: invalid file data')
            }
        } catch (e) {
            throw new Error(`Failed to send file: ${e}`)
        }
    }
    reply(content, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof content === 'string')
                content = { text: content };
            return this._client.sendMessage(this.id, content, Object.assign({ quoted: this._msg }, options));
        });
    }
    replyWithJid(jid, content, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._client.sendMessage(jid, content, Object.assign({ quoted: this._msg }, options));
        });
    }
    react(jid, emoji, key) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._client.sendMessage(jid, {
                react: { text: emoji, key: key ? key : this._msg.key },
            });
        });
    }
    MessageCollector(args = {
        filter: function (args, collector) {
            throw new Error("Function not implemented.");
        },
        time: 0,
        max: 0,
        maxProcessed: 0
    }) {
        return new MessageCollector_1.MessageCollector({ self: this._self, msg: this._msg }, args);
    }
    awaitMessages(args = {
        filter: function (args, collector) {
            throw new Error("Function not implemented.");
        },
        time: 0,
        max: 0,
        maxProcessed: 0
    }) {
        return new Promise((resolve, reject) => {
            const col = this.MessageCollector(args);
            col.once("end", (collected, r) => {
                var _a;
                if ((_a = args.endReason) === null || _a === void 0 ? void 0 : _a.includes(r)) {
                    reject(collected);
                }
                else {
                    resolve(collected);
                }
            });
        });
    }
    getMessageType() {
        return this._msg.messageType;
    }
    getMediaMessage(msg, type) {
        return __awaiter(this, void 0, void 0, function* () {
            let buffer = yield (0, baileys_1.downloadMediaMessage)(msg, type, {}, { logger: this._self.logger, reuploadRequest: this._client.updateMediaMessage });
            return buffer;
        });
    }
    read() {
        let m = this._msg;
        this._client.readMessages([
            {
                remoteJid: m.key.remoteJid,
                id: m.key.id,
                participant: m.key.participant
            },
        ]);
    }
    simulateTyping() {
        this._client.sendPresenceUpdate('composing', this.id);
    }
    deleteMessage(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._client.sendMessage(this.id, { delete: key });
        });
    }
    simulateRecording() {
        this._client.sendPresenceUpdate('recording', this.id);
    }
    editMessage(key, newText) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._client.relayMessage(this.id, {
                protocolMessage: {
                    key,
                    type: 14,
                    editedMessage: {
                        conversation: newText
                    }
                }
            }, {});
        });
    }
    sendPoll(jid, args) {
        return __awaiter(this, void 0, void 0, function* () {
            args.selectableCount = args.singleSelect ? true : false;
            return this._client.sendMessage(jid, { poll: args });
        });
    }
    getMentioned() {
        var _a, _b;
        return ((_a = this._msg.message) === null || _a === void 0 ? void 0 : _a.extendedTextMessage) ? (_b = this._msg.message.extendedTextMessage.contextInfo) === null || _b === void 0 ? void 0 : _b.mentionedJid : [];
    }
    getDevice(id) {
        return (0, baileys_1.getDevice)(id ? id : this._msg.key.id);
    }
    isGroup() {
        var _a;
        return (_a = this.id) === null || _a === void 0 ? void 0 : _a.endsWith("@g.us");
    }
    async groupData() {
        var _a;
        return (_a = this._msg) === null || _a === void 0 ? {} : this.isGroup() ? await this._client.groupMetadata(this.id) : {}
    }
}
exports.Ctx = Ctx;
