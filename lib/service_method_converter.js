"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const storage_1 = require("./storage");
function wrapUnaryMethod(func) {
    return (call, callback) => {
        func(call.request)
            .then(result => callback(null, result))
            .catch(err => callback(err, null));
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