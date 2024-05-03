"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const baileys_1 = __importStar(require("@whiskeysockets/baileys"));
const pino_1 = __importDefault(require("pino"));
const undici_1 = require("undici");
const events_1 = __importDefault(require("events"));
const Events_1 = require("../Constant/Events");
const collection_1 = require("@discordjs/collection");
const Ctx_1 = require("./Ctx");
const Functions_1 = require("../Common/Functions");
const MessageEvents_1 = require("../Handler/MessageEvents");
class Client {
    constructor(opts) {
        var _a, _b, _c, _d, _e, _f;
        this.name = opts.name;
        this.prefix = opts.prefix;
        this.readIncommingMsg = (_a = opts.readIncommingMsg) !== null && _a !== void 0 ? _a : false;
        this.authDir = (_b = opts.authDir) !== null && _b !== void 0 ? _b : './state';
        this.printQRInTerminal = (_c = opts.printQRInTerminal) !== null && _c !== void 0 ? _c : true;
        this.qrTimeout = (_d = opts.qrTimeout) !== null && _d !== void 0 ? _d : 60000;
        this.markOnlineOnConnect = (_e = opts.markOnlineOnConnect) !== null && _e !== void 0 ? _e : true;
        this.logger = (_f = opts.logger) !== null && _f !== void 0 ? _f : (0, pino_1.default)({ level: "fatal" });
        this.ev = new events_1.default();
        this.cmd = new collection_1.Collection();
        this.cooldown = new collection_1.Collection();
        this.hearsMap = new collection_1.Collection();
        if (typeof this.prefix === "string")
            this.prefix = this.prefix.split('');
    }
    WAVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            let version = [2, 2353, 56];
            try {
                let { body } = yield (0, undici_1.request)("https://web.whatsapp.com/check-update?version=1&platform=web");
                const data = yield body.json();
                version = data.currentVersion.split(".").map(Number);
            }
            catch (_a) {
                version = version;
            }
            return version;
        });
    }
    onConnectionUpdate() {
        var _a;
        (_a = this.core) === null || _a === void 0 ? void 0 : _a.ev.on('connection.update', (update) => {
            var _a, _b, _c;
            const { connection, lastDisconnect } = update;
            if (update.qr)
                this.ev.emit(Events_1.Events.QR, update.qr);
            if (connection === 'close') {
                const shouldReconnect = ((_b = (_a = lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode) !== baileys_1.DisconnectReason.loggedOut;
                console.log('connection closed due to ', lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error, ', reconnecting ', shouldReconnect);
                if (shouldReconnect)
                    this.launch();
            }
            else if (connection === 'open') {
                this.readyAt = Date.now();
                (_c = this.ev) === null || _c === void 0 ? void 0 : _c.emit(Events_1.Events.ClientReady, this.core);
            }
        });
    }
    onCredsUpdate() {
        var _a;
        (_a = this.core) === null || _a === void 0 ? void 0 : _a.ev.on("creds.update", this.saveCreds);
    }
    read(m) {
        var _a;
        (_a = this.core) === null || _a === void 0 ? void 0 : _a.readMessages([
            {
                remoteJid: m.key.remoteJid,
                id: m.key.id,
                participant: m.key.participant
            },
        ]);
    }
    onMessage() {
        var _a;
        (_a = this.core) === null || _a === void 0 ? void 0 : _a.ev.on("messages.upsert", (m) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            let msgType = (0, baileys_1.getContentType)(m.messages[0].message);
            let text = (0, Functions_1.getContentFromMsg)(m.messages[0]);
            m.content = null;
            if (text === null || text === void 0 ? void 0 : text.length)
                m.content = text;
            m.messageType = msgType;
            m = Object.assign(Object.assign({}, m), m.messages[0]);
            delete m.messages;
            let self = Object.assign(Object.assign({}, this), { getContentType: baileys_1.getContentType, m });
            m = seriM(self, m)
            self.m = m
            if (MessageEvents_1.MessageEventList[msgType]) {
                yield MessageEvents_1.MessageEventList[msgType](m, this.ev, self, this.core);
            }
            (_b = this.ev) === null || _b === void 0 ? void 0 : _b.emit(Events_1.Events.MessagesUpsert, m, new Ctx_1.Ctx({ used: { upsert: m.content }, args: [], self, client: this.core }));
            if (this.readIncommingMsg)
                this.read(m);
            try {
            yield require('../Handler/Commands')(self);
            }catch(e){logg(e)}
        }));
    }
    onGroupParticipantsUpdate() {
        var _a;
        (_a = this.core) === null || _a === void 0 ? void 0 : _a.ev.on("group-participants.update", (m) => __awaiter(this, void 0, void 0, function* () {
            if (m.action === "add")
                return this.ev.emit(Events_1.Events.UserJoin, m);
            if (m.action === "remove")
                return this.ev.emit(Events_1.Events.UserLeave, m);
        }));
    }
    onGroupsJoin() {
        var _a;
        (_a = this.core) === null || _a === void 0 ? void 0 : _a.ev.on('groups.upsert', (m) => {
            this.ev.emit(Events_1.Events.GroupsJoin, m);
        });
    }
    /**
     * Create a new command.
     * @param opts Command options object or command name string.
     * @param code If the first parameter is a command name as a string, then you should create a callback function in second parameter.
     * @example
     * ```
     * bot.command('ping', async(ctx) => ctx.reply({ text: 'Pong!' }));
     *
     * // same as
     *
     * bot.command({
     *     name: 'ping',
     *     code: async(ctx) => {
     *         ctx.reply('Pong!');
     *     }
     * });
     * ```
     */
    command(opts, code) {
        var _a, _b;
        if (typeof opts !== 'string')
            return (_a = this.cmd) === null || _a === void 0 ? void 0 : _a.set(this.cmd.size, opts);
        if (!code)
            code = () => __awaiter(this, void 0, void 0, function* () { return null; });
        return (_b = this.cmd) === null || _b === void 0 ? void 0 : _b.set(this.cmd.size, { name: opts, code });
    }
    /**
     * "Callback" will be triggered when someone sends the "query" in the chats. Hears function like command but without command prefix.
     * @param query The trigger.
     * @param callback Callback function
     */
    hears(query, callback) {
        this.hearsMap.set(this.hearsMap.size, { name: query, code: callback });
    }
    /**
     * Set the bot bio/about.
     * @param content The bio content.
     */
    bio(content) {
        var _a;
        (_a = this.core) === null || _a === void 0 ? void 0 : _a.query({
            tag: "iq",
            attrs: {
                to: "@s.whatsapp.net",
                type: "set",
                xmlns: "status",
            },
            content: [
                {
                    tag: "status",
                    attrs: {},
                    content,
                },
            ],
        });
    }
    /**
     * Fetch bio/about from given Jid or if the param empty will fetch the bot bio/about.
     * @param [jid] the jid.
     */
    fetchBio(jid) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let decodedJid = (0, baileys_1.jidDecode)(jid ? jid : (_b = (_a = this.core) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id);
            let re = yield ((_c = this.core) === null || _c === void 0 ? void 0 : _c.fetchStatus(decodedJid));
            return re;
        });
    }
    requestPairCode(number) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let re = yield ((_c = this.core) === null || _c === void 0 ? void 0 : _c.requestPairingCode(number));
            return re;
        });
    }
    launch() {
        return __awaiter(this, void 0, void 0, function* () {
            const { state, saveCreds } = yield (0, baileys_1.useMultiFileAuthState)(this.authDir);
            this.state = state;
            this.saveCreds = saveCreds;
            const version = yield this.WAVersion();
            this.core = (0, baileys_1.default)({
                logger: this.logger,
                printQRInTerminal: this.printQRInTerminal,
                auth: this.state,
                browser: [this.name, "Chrome", "1.0.0"],
                version,
                qrTimeout: this.qrTimeout,
                markOnlineOnConnect: this.markOnlineOnConnect
            });
            this.onConnectionUpdate();
            this.onCredsUpdate();
            try{
            this.onMessage();
            }catch(e){logg(e)}
            this.onGroupParticipantsUpdate();
            this.onGroupsJoin();
        });
    }
    sleep(ms) {
        return new Promise(res => setTimeout(res, ms))
    }
    _launchPairing(number) {
        return __awaiter(this, void 0, void 0, function* () {
            const { state, saveCreds } = yield (0, baileys_1.useMultiFileAuthState)(this.authDir);
            this.state = state;
            this.saveCreds = saveCreds;
            const version = yield this.WAVersion();
            this.core = (0, baileys_1.default)({
                logger: this.logger,
                printQRInTerminal: this.printQRInTerminal,
                auth: this.state,
                browser: ["Ubuntu", "Firefox", "123.0"],
                version,
                qrTimeout: this.qrTimeout,
                markOnlineOnConnect: this.markOnlineOnConnect
            });
            yield this.sleep(2000)
            console.log(`Pairing code: ${yield this.requestPairCode(number)}`)
            this.onConnectionUpdate();
            this.onCredsUpdate();
            try{
            this.onMessage();
            }catch(e){logg(e)}
            this.onGroupParticipantsUpdate();
            this.onGroupsJoin();
        });
    }
    async launchPairing(number) {
        return await this._launchPairing(number)
    }
}
exports.Client = Client;
