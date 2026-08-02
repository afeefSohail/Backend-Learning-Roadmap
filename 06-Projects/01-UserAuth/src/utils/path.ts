import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Define a structural interface wrapper for the returned object shape
interface AbsolutePaths {
  __filename: string;
  __dirname: string;
}

/**
 * Generates __dirname and __filename dynamically for any ES Module file.
 * @param {string} metaUrl - Pass 'import.meta.url' from the calling file.
 */
export const getPaths = (metaUrl: string): AbsolutePaths => {
    const __filename = fileURLToPath(metaUrl);
    const __dirname = path.dirname(__filename);
    
    return { __filename, __dirname };
};
