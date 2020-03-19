"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const util_1 = require("util");
const fs_1 = require("fs");
const path_1 = require("path");
const protobufjs_1 = require("protobufjs");
const pbjs_1 = require("protobufjs/cli/pbjs");
const storage_1 = require("./storage");
const utils_1 = require("./utils");
const log = debug_1.default('typescript-grpc:proto-generator');
const writeFileAsync = util_1.promisify(fs_1.writeFile);
const pbjsCliAsync = util_1.promisify(pbjs_1.main);
function generateProto(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const filename = utils_1.getFilename(name);
        const decoratedRoot = protobufjs_1.roots['decorated'];
        Object.keys(storage_1.serviceStorage).forEach((serviceName) => {
            console.log(`adding ${serviceName}`);
            decoratedRoot.add(storage_1.serviceStorage[serviceName]);
        });
        yield writeFileAsync(path_1.resolve(process.cwd(), `${filename}.json`), JSON.stringify(decoratedRoot.toJSON(), null, 2));
        const proto = yield pbjsCliAsync(['--target', 'proto3', '-o', filename, `${filename}.json`]);
        log(proto);
        return path_1.resolve(process.cwd(), filename);
    });
}
exports.generateProto = generateProto;
//# sourceMappingURL=proto_generator.js.map