import makeWASocket, { proto } from "baileys";
import fs from "fs";
export declare const arrayMove: (arr: undefined[], old_index: number, new_index: number) => undefined[];
export declare const getContentFromMsg: (msg: {
    message: proto.IMessage;
}) => string | null | undefined;
export declare const getSender: (msg: proto.IWebMessageInfo, client: ReturnType<typeof makeWASocket>) => string | null | undefined;
export declare const walk: (dir: string, callback: (filepath: string, stats?: fs.StatsBase<number>) => {}) => void;
export declare const decodeJid: (jid: string) => string;
//# sourceMappingURL=Functions.d.ts.map