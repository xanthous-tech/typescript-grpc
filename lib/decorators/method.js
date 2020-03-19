"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const protobufjs_1 = require("protobufjs");
const storage_1 = require("../storage");
const RPC = 'rpc';
function Method(options) {
    return function methodMethodDecorator(target, propertyKey) {
        const { name, requestType, responseType, requestStream, responseStream } = options;
        const serviceName = target.constructor.name;
        const methodName = name || propertyKey;
        const methodStorageKey = storage_1.getMethodStorageKey(serviceName, methodName);
        if (storage_1.methodStorage[methodStorageKey]) {
            throw new Error(`service method name clash! ${methodStorageKey}`);
        }
        const protobufMethod = new protobufjs_1.Method(methodName, RPC, requestType, responseType, requestStream, responseStream);
        storage_1.methodStorage[methodStorageKey] = protobufMethod;
        if (!storage_1.serviceMethodConnections[target.constructor.name]) {
            storage_1.serviceMethodConnections[target.constructor.name] = [];
        }
        storage_1.serviceMethodConnections[target.constructor.name].push(methodName);
    };
}
exports.Method = Method;
//# sourceMappingURL=method.js.map