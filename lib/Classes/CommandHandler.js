"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandHandler = void 0;
const Functions_1 = require("../Common/Functions");
class CommandHandler {
    /**
     * Create a new command handler instance
     *
     * ```ts
     * import { CommandHandler } from "@mat3rwelon/sugar";
     * import path from "path";
     *
     * const cmd = new CommandHandler(bot, path.resolve() + '/path/to/dir');
     * cmd.load();
     *
     * ```
     *
     * @param bot The bot instance
     * @param path A string that represent a path to commands directory. Recomended using `path` library.
     *
     * ```ts
     * import path from "path";
     * const cmd = new CommandHandler(bot, path.resolve() + '/path/to/dir');
     * ```
     */
    constructor(bot, path) {
        this._bot = bot;
        this._path = path;
    }
    load() {
        (0, Functions_1.walk)(this._path, (x) => {
            let cmdObj = require(x);
            if (!cmdObj.type || cmdObj.type === 'command') {
                this._bot.cmd.set(cmdObj.name, cmdObj);
                console.log(`[sugar CommandHandler] Loaded - ${cmdObj.name}`);
            }
            else if (cmdObj.type === 'hears') {
                this._bot.hearsMap.set(cmdObj.name, cmdObj);
                console.log(`[sugar CommandHandler] Loaded Hears - ${cmdObj.name}`);
            }
        });
    }
}
exports.CommandHandler = CommandHandler;
