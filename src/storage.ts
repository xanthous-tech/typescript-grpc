import { Method, Service } from 'protobufjs';

const SERVICE_METHOD_DELIMITER = '::';

export function getMethodStorageKey(serviceName: string, methodName: string): string {
  return `${serviceName}${SERVICE_METHOD_DELIMITER}${methodName}`;
}

// connection lookup between services and methods
export const serviceMethodConnections: {
  [key: string]: string[];
} = {};

// method storage
export const methodStorage: {
  [key: string]: Method;
} = {};

// service storage
export const serviceStorage: {
  [key: string]: Service;
} = {};
