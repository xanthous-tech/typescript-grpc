import { Method as ProtobufMethod } from 'protobufjs';

import { serviceMethodConnections, methodStorage, getMethodStorageKey } from '../storage';

const RPC = 'rpc';

export function Method(options: {
  name?: string;
  requestType: string;
  responseType: string;
  requestStream: boolean;
  responseStream: boolean;
}): MethodDecorator {
  // TODO: need some sort of descriptor check
  return function methodMethodDecorator(target: Record<string, any>, propertyKey: string): void {
    const { name, requestType, responseType, requestStream, responseStream } = options;

    const serviceName = target.constructor.name;
    const methodName = name || propertyKey;
    const methodStorageKey = getMethodStorageKey(serviceName, methodName);

    if (methodStorage[methodStorageKey]) {
      throw new Error(`service method name clash! ${methodStorageKey}`);
    }

    const protobufMethod = new ProtobufMethod(methodName, RPC, requestType, responseType, requestStream, responseStream);

    methodStorage[methodStorageKey] = protobufMethod;

    if (!serviceMethodConnections[target.constructor.name]) {
      serviceMethodConnections[target.constructor.name] = [];
    }

    serviceMethodConnections[target.constructor.name].push(methodName);
  };
}
