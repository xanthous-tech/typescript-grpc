import { UntypedServiceImplementation, ServerUnaryCall, ServiceError, Metadata } from 'grpc';
import { Method } from 'protobufjs';

import { serviceMethodConnections, methodStorage, getMethodStorageKey } from './storage';

/**
 * Callback function passed to server handlers that handle methods with
 * unary responses.
 */
type sendUnaryData<ResponseType> = (error: ServiceError | null, value: ResponseType | null, trailer?: Metadata, flags?: number) => void;

function wrapUnaryMethod(func: (arg: any) => Promise<any>): (call: ServerUnaryCall<any>, callback: sendUnaryData<any>) => void {
  return (call: ServerUnaryCall<any>, callback: sendUnaryData<any>): void => {
    func(call.request)
      .then(result => callback(null, result))
      .catch(err => callback(err, null));
  };
}

export function wrapServiceMethods(serviceObject: any): UntypedServiceImplementation {
  const result: UntypedServiceImplementation = {};

  const ctor = serviceObject.constructor;
  const serviceName = ctor.name;

  const methods: string[] = serviceMethodConnections[serviceName];

  methods.forEach((methodName: string) => {
    const methodStorageKey = getMethodStorageKey(serviceName, methodName);
    const method: Method = methodStorage[methodStorageKey];

    if (method.requestStream) {
      if (method.responseStream) {
        // bidi
      } else {
        // request streaming
      }
    } else {
      if (method.responseStream) {
        // response streaming
      } else {
        // unary call
        result[methodName] = wrapUnaryMethod(serviceObject[methodName] as (arg: any) => Promise<any>);
      }
    }
  });

  return result;
}
