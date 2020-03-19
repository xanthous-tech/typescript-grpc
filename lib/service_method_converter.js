"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const storage_1 = require("./storage");
const log = debug_1.default('typescript-grpc:service-method-converter');
function wrapUnaryMethod(func) {
    return (call, callback) => {
        log('unary call is invoked');
        const arg = call.request;
        func(arg)
            .then(result => callback(null, result))
            .catch(err => callback(err, null));
    };
}
function wrapResponseStreamMethod(func) {
    return (call) => {
        log('response streaming call is invoked');
        const arg = call.request;
        func(arg).subscribe(next => {
            log('writing response');
            log(next);
            call.write(next);
        }, err => call.emit('error', err), () => call.end());
    };
}
function wrapServiceMethods(serviceObject) {
    const result = {};
    const ctor = serviceObject.constructor;
    const serviceName = ctor.name;
    const methods = storage_1.serviceMethodConnections[serviceName];
    methods.forEach((methodName) => {
        const methodStorageKey = storage_1.getMethodStorageKey(serviceName, methodName);
        const method = storage_1.methodStorage[methodStorageKey];
        if (method.requestStream) {
            if (method.responseStream) {
            }
            else {
            }
        }
        else {
            if (method.responseStream) {
                result[methodName] = wrapResponseStreamMethod(serviceObject[methodName]);
            }
            else {
                result[methodName] = wrapUnaryMethod(serviceObject[methodName]);
            }
        }
    });
    return result;
}
exports.wrapServiceMethods = wrapServiceMethods;
//# sourceMappingURL=service_method_converter.js.map