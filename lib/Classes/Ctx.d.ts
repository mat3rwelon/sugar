/// <reference types="node" />
import { Collection } from "@discordjs/collection";
import { ICollectorOptions, ICommandOptions, ICtx, ICtxOptions, ICtxSelf, IMessageInfo } from "../Common/Types";
import makeWASocket, { AnyMessageContent, MiscMessageGenerationOptions } from "baileys";
import { WAProto } from "baileys";
import { MessageCollector } from "./Collector/MessageCollector";
export declare class Ctx implements ICtx {
    _used: {
        prefix: string | string[];
        command: string;
    };
    _args: string[];
    _self: ICtxSelf;
    _client: ReturnType<typeof makeWASocket>;
    _msg: IMessageInfo;
    _sender: {
        jid: string | null | undefined;
        pushName: string | null | undefined;
    };
    _config: {
        name: string | RegExp | string[];
        prefix: string | RegExp | string[];
        cmd: Collection<number | ICommandOptions, any> | undefined;
    };
    constructor(options: ICtxOptions);
    get id(): string | null | undefined;
    get args(): Array<string>;
    get msg(): IMessageInfo;
    get sender(): {
        jid: string | null | undefined;
        pushName: string | null | undefined;
    };
    sendMessage(jid: string, content: AnyMessageContent, options?: MiscMessageGenerationOptions): Promise<undefined | WAProto.WebMessageInfo>;
    reply(content: AnyMessageContent | string, options?: MiscMessageGenerationOptions): Promise<undefined | WAProto.WebMessageInfo>;
    replyWithJid(jid: string, content: AnyMessageContent, options?: MiscMessageGenerationOptions): Promise<undefined | WAProto.WebMessageInfo>;
    react(jid: string, emoji: string, key?: WAProto.IMessageKey): Promise<undefined | WAProto.WebMessageInfo>;
    MessageCollector(args?: ICollectorOptions): MessageCollector;
    awaitMessages(args?: ICollectorOptions): Promise<unknown>;
    getMessageType(): keyof WAProto.IMessage | undefined;
    getMediaMessage(msg: IMessageInfo, type: 'buffer' | 'stream'): Promise<Buffer | import('stream').Transform>;
    read(): void;
    simulateTyping(): void;
    deleteMessage(key: WAProto.IMessageKey): Promise<undefined | WAProto.WebMessageInfo>;
    simulateRecording(): void;
    editMessage(key: WAProto.IMessageKey, newText: string): Promise<void>;
    sendPoll(jid: string, args: {
        name: string;
        values: Array<string>;
        singleSelect: boolean;
        selectableCount?: boolean;
    }): Promise<undefined | WAProto.WebMessageInfo>;
    getMentioned(): string[] | null | undefined;
    getDevice(id: string | undefined): "android" | "unknown" | "web" | "ios" | "desktop";
    isGroup(): boolean | undefined;
}
//# sourceMappingURL=Ctx.d.ts.map