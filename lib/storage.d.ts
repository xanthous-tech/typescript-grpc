import { Method, Service } from 'protobufjs';
export declare function getMethodStorageKey(serviceName: string, methodName: string): string;
export declare const serviceMethodConnections: {
    [key: string]: string[];
};
export declare const methodStorage: {
    [key: string]: Method;
};
export declare const serviceStorage: {
    [key: string]: Service;
};
