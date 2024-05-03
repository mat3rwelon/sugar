export declare class CommandHandler {
    _bot: any;
    _path: string;
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
    constructor(bot: any, path: string);
    load(): void;
}
//# sourceMappingURL=CommandHandler.d.ts.map