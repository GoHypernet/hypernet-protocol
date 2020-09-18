import { Argv } from 'yargs';
declare const _default: {
    command: string;
    describe: string;
    builder: (yargs: Argv<{}>) => Argv<{}>;
    handler: (argv: {
        [key: string]: any;
    } & {
        [x: string]: unknown;
        _: string[];
        $0: string;
    }) => Promise<void>;
};
export default _default;
//# sourceMappingURL=start.d.ts.map