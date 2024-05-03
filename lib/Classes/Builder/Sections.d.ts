import { ISectionsOptions, ISectionsRows } from "../../Common/Types";
/**
 * @deprecated Will not work on most devices.
 */
export declare class SectionsBuilder {
    title: string | null;
    rows: ISectionsRows[];
    constructor(opts?: ISectionsOptions);
    setTitle(title: string): this;
    setRows(...row: ISectionsRows[]): this;
}
//# sourceMappingURL=Sections.d.ts.map