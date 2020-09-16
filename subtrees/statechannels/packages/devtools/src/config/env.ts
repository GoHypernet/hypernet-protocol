import * as fs from 'fs';
import * as path from 'path';

export function getEnvBool(name: string, throwIfMissing = true): boolean {
  const val = process.env[name];

  if (throwIfMissing && val === undefined) {
    throw Error(`Environment variable ${name} is not set.`);
  }

  switch (process.env[name]) {
    case undefined:
    case null:
    case 'null':
    case 'false':
    case 'FALSE':
    case '0':
      return false;
    default:
      return true;
  }
}

export function configureEnvVariables(): void {
  const scEnvFilesDirectory = process.env.MONOREPO_ROOT || '../..';

  // State Channel Environment
  // Intended usage is a single file in monorepo root defining configuration for multiple packages
  const SC_ENV = process.env.SC_ENV;
  if (SC_ENV) {
    const scEnvFile = path.join(scEnvFilesDirectory, '.env.' + SC_ENV);
    const scEnvFileFullPath = path.join(process.cwd(), scEnvFile);
    if (!fs.existsSync(scEnvFileFullPath)) {
      throw new Error(`${scEnvFileFullPath} must exist in the monorepo root`);
    }

    /* eslint-disable @typescript-eslint/no-var-requires */
    const result = require('dotenv-expand')(
      require('dotenv').config({
        path: scEnvFile
      })
    );
    console.log('The following env vars were loaded to process.env:');
    console.log(result);
    /* eslint-enable @typescript-eslint/no-var-requires */
    return;
  }

  if (!process.env.NODE_ENV) {
    console.warn('[@statechannels/devtools] NODE_ENV is undefined — setting to "development"');
    process.env.NODE_ENV = 'development';
  }

  const NODE_ENV = process.env.NODE_ENV;

  // https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
  // NOTE: dotenv joins paths with cwd https://www.npmjs.com/package/dotenv#path
  let dotenvFiles = ['.env'];

  if (NODE_ENV) dotenvFiles = dotenvFiles.concat([`.env.${NODE_ENV}.local`, `.env.${NODE_ENV}`]);

  if (NODE_ENV && NODE_ENV !== 'test')
    // Don't include `.env.local` for `test` environment
    // since normally you expect tests to produce the same
    // results for everyone
    dotenvFiles.push('.env.local');

  const monorepoDotenvFiles = dotenvFiles.slice(0);

  dotenvFiles.forEach((dotenvFile: string) => {
    monorepoDotenvFiles.push(path.join('../..', dotenvFile));
  });

  dotenvFiles = monorepoDotenvFiles;

  // Load environment variables from .env* files. Suppress warnings using silent
  // if this file is missing. dotenv will never modify any environment variables
  // that have already been set.  Variable expansion is supported in .env files.
  // https://github.com/motdotla/dotenv
  // https://github.com/motdotla/dotenv-expand
  dotenvFiles.forEach((dotenvFile: string) => {
    if (fs.existsSync(dotenvFile)) {
      // Need to refactor away from this
      /* eslint-disable @typescript-eslint/no-var-requires */
      require('dotenv-expand')(
        require('dotenv').config({
          path: dotenvFile
        })
      );
      /* eslint-enable @typescript-eslint/no-var-requires */
    }
  });
}
