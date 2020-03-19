"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const protobufjs_1 = require("protobufjs");
const storage_1 = require("../storage");
function Service(options = {}) {
    return function serviceClassDecorator(target) {
        const serviceName = options.name || target.name;
        const protobufService = new protobufjs_1.Service(serviceName);
        if (storage_1.serviceMethodConnections[serviceName] && Array.isArray(storage_1.serviceMethodConnections[serviceName])) {
            storage_1.serviceMethodConnections[serviceName].forEach((methodName) => {
                protobufService.add(storage_1.methodStorage[storage_1.getMethodStorageKey(serviceName, methodName)]);
            });
        }
        storage_1.serviceStorage[serviceName] = protobufService;
    };
}
exports.Service = Service;
//# sourceMappingURL=service.js.map