import debug from 'debug';
import { UntypedServiceImplementation, ServerUnaryCall, ServiceError, Metadata, ServerWritableStream } from 'grpc';
import { Method } from 'protobufjs';

import { serviceMethodConnections, methodStorage, getMethodStorageKey } from './storage';
import { Observable } from 'rxjs';

const log = debug('typescript-grpc:service-method-converter');

/**
 * Callback function passed to server handlers that handle methods with
 * unary responses.
 */
type sendUnaryData<ResponseType> = (error: ServiceError | null, value: ResponseType | null, trailer?: Metadata, flags?: number) => void;

function wrapUnaryMethod(func: (arg: any) => Promise<any>): (call: ServerUnaryCall<any>, callback: sendUnaryData<any>) => void {
  return (call: ServerUnaryCall<any>, callback: sendUnaryData<any>): void => {
    log('unary call is invoked');
    const arg = call.request;
    func(arg)
      .then(result => callback(null, result))
      .catch(err => callback(err, null));
  };
}

function wrapResponseStreamMethod(func: (arg: any) => Observable<any>): (call: ServerWritableStream<any>) => void {
  return (call: ServerWritableStream<any>): void => {
    log('response streaming call is invoked');
    const arg = call.request;
    func(arg).subscribe(
      next => {
        log('writing response');
        log(next);
        call.write(next);
      },
      err => call.emit('error', err),
      () => call.end(),
    );
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
        result[methodName] = wrapResponseStreamMethod(serviceObject[methodName]);
      } else {
        // unary call
        result[methodName] = wrapUnaryMethod(serviceObject[methodName]);
      }
    }
  });

  return result;
}
