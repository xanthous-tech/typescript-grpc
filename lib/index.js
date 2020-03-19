"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var service_1 = require("./decorators/service");
exports.Service = service_1.Service;
var method_1 = require("./decorators/method");
exports.Method = method_1.Method;
var proto_generator_1 = require("./proto_generator");
exports.generateProto = proto_generator_1.generateProto;
var service_method_converter_1 = require("./service_method_converter");
exports.wrapServiceMethods = service_method_converter_1.wrapServiceMethods;
//# sourceMappingURL=index.js.map