"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SERVICE_METHOD_DELIMITER = '::';
function getMethodStorageKey(serviceName, methodName) {
    return `${serviceName}${SERVICE_METHOD_DELIMITER}${methodName}`;
}
exports.getMethodStorageKey = getMethodStorageKey;
exports.serviceMethodConnections = {};
exports.methodStorage = {};
exports.serviceStorage = {};
//# sourceMappingURL=storage.js.map