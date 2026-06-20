interface AbsolutePaths {
    __filename: string;
    __dirname: string;
}
/**
 * Generates __dirname and __filename dynamically for any ES Module file.
 * @param {string} metaUrl - Pass 'import.meta.url' from the calling file.
 */
export declare const getPaths: (metaUrl: string) => AbsolutePaths;
export {};
//# sourceMappingURL=path.d.ts.map