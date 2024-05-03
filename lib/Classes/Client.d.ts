/// <reference types="node" />
import makeWASocket from "baileys";
import { AuthenticationState } from "baileys/lib/Types";
import EventEmitter from "events";
import { Collection } from "@discordjs/collection";
import { IClientOptions, ICommandOptions, IMessageInfo } from "../Common/Types";
import { Ctx } from "./Ctx";
export declare class Client {
    name: string;
    prefix: Array<string> | string | RegExp;
    readIncommingMsg?: boolean;
    authDir?: string;
    printQRInTerminal?: boolean;
    state?: AuthenticationState;
    saveCreds: any;
    core: ReturnType<typeof makeWASocket>;
    ev: EventEmitter;
    cmd?: Collection<ICommandOptions | number, any>;
    cooldown?: Collection<unknown, unknown>;
    readyAt?: number;
    hearsMap: Collection<number, any>;
    qrTimeout?: number;
    markOnlineOnConnect?: boolean;
    logger?: any;
    constructor(opts: IClientOptions);
    WAVersion(): Promise<[number, number, number]>;
    onConnectionUpdate(): void;
    onCredsUpdate(): void;
    read(m: IMessageInfo): void;
    onMessage(): void;
    onGroupParticipantsUpdate(): void;
    onGroupsJoin(): void;
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
    command(opts: ICommandOptions | string, code?: (ctx: Ctx) => Promise<any>): Collection<number | ICommandOptions, any> | undefined;
    /**
     * "Callback" will be triggered when someone sends the "query" in the chats. Hears function like command but without command prefix.
     * @param query The trigger.
     * @param callback Callback function
     */
    hears(query: string | Array<string> | RegExp, callback: (ctx: Ctx) => Promise<any>): void;
    /**
     * Set the bot bio/about.
     * @param content The bio content.
     */
    bio(content: string): void;
    /**
     * Fetch bio/about from given Jid or if the param empty will fetch the bot bio/about.
     * @param [jid] the jid.
     */
    fetchBio(jid?: string): Promise<undefined | {
        setAt: Date;
        status: undefined | string;
    }>;
    launch(): Promise<void>;
}
//# sourceMappingURL=Client.d.ts.map