import debug from 'debug';
import { promisify } from 'util';
import { writeFile } from 'fs';
import { resolve } from 'path';
import { roots } from 'protobufjs';
import { main as pbjsCli } from 'protobufjs/cli/pbjs';

import { serviceStorage } from './storage';
import { getFilename } from './utils';

const log = debug('typescript-grpc:proto-generator');

const writeFileAsync = promisify(writeFile);
const pbjsCliAsync = promisify(pbjsCli);

export async function generateProto(name: string): Promise<string> {
  const filename = getFilename(name);

  const decoratedRoot = roots['decorated'];

  Object.keys(serviceStorage).forEach((serviceName: string) => {
    console.log(`adding ${serviceName}`);
    decoratedRoot.add(serviceStorage[serviceName]);
  });

  await writeFileAsync(resolve(process.cwd(), `${filename}.json`), JSON.stringify(decoratedRoot.toJSON(), null, 2));

  const proto = await pbjsCliAsync(['--target', 'proto3', '-o', filename, `${filename}.json`]);

  log(proto);

  return resolve(process.cwd(), filename);
}
