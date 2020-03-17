import { Method as ProtobufMethod } from "protobufjs";

import { serviceMethodConnections, methodStorage } from '../storage';

const RPC = 'rpc';

export function Method(options: {
  name?: string;
  requestType: string;
  responseType: string;
  requestStream: boolean;
  responseStream: boolean;
}): MethodDecorator {
  // TODO: need some sort of descriptor check
  return function methodMethodDecorator(
    target: Object,
    propertyKey: string,
  ): void {
    const {
      name,
      requestType,
      responseType,
      requestStream,
      responseStream,
    } = options;

    const methodName = name || propertyKey;

    const protobufMethod = new ProtobufMethod(
      methodName,
      RPC,
      requestType,
      responseType,
      requestStream,
      responseStream,
    );

    methodStorage[methodName] = protobufMethod;

    if (!serviceMethodConnections[target.constructor.name]) {
      serviceMethodConnections[target.constructor.name] = [];
    }

    serviceMethodConnections[target.constructor.name].push(methodName);
  };
}
