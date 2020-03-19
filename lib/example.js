"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const protobufjs_1 = require("protobufjs");
const proto_loader_1 = require("@grpc/proto-loader");
const grpc_1 = require("grpc");
const rxjs_1 = require("rxjs");
const Ops = __importStar(require("rxjs/operators"));
const _1 = require(".");
const log = debug_1.default('typescript-grpc:example');
let Movie = class Movie extends protobufjs_1.Message {
};
__decorate([
    protobufjs_1.Field.d(1, 'string'),
    __metadata("design:type", String)
], Movie.prototype, "name", void 0);
__decorate([
    protobufjs_1.Field.d(2, 'int32'),
    __metadata("design:type", Number)
], Movie.prototype, "year", void 0);
__decorate([
    protobufjs_1.Field.d(3, 'float'),
    __metadata("design:type", Number)
], Movie.prototype, "rating", void 0);
__decorate([
    protobufjs_1.Field.d(4, 'string', 'repeated'),
    __metadata("design:type", Array)
], Movie.prototype, "cast", void 0);
Movie = __decorate([
    protobufjs_1.Type.d()
], Movie);
let MoviesResult = class MoviesResult extends protobufjs_1.Message {
};
__decorate([
    protobufjs_1.Field.d(1, Movie, 'repeated'),
    __metadata("design:type", Array)
], MoviesResult.prototype, "result", void 0);
MoviesResult = __decorate([
    protobufjs_1.Type.d()
], MoviesResult);
let EmptyRequest = class EmptyRequest extends protobufjs_1.Message {
};
EmptyRequest = __decorate([
    protobufjs_1.Type.d()
], EmptyRequest);
let SearchByCastInput = class SearchByCastInput extends protobufjs_1.Message {
};
__decorate([
    protobufjs_1.Field.d(1, 'string'),
    __metadata("design:type", String)
], SearchByCastInput.prototype, "castName", void 0);
SearchByCastInput = __decorate([
    protobufjs_1.Type.d()
], SearchByCastInput);
let ExampleService = class ExampleService {
    getMovies(req) {
        return __awaiter(this, void 0, void 0, function* () {
            log('get movies called');
            return new MoviesResult({ result: [] });
        });
    }
    searchMoviesByCast(req) {
        log(req);
        const movies = [
            {
                cast: ['Tom Cruise', 'Simon Pegg', 'Jeremy Renner'],
                name: 'Mission: Impossible Rogue Nation',
                rating: 0.97,
                year: 2015,
            },
            {
                cast: ['Tom Cruise', 'Simon Pegg', 'Henry Cavill'],
                name: 'Mission: Impossible - Fallout',
                rating: 0.93,
                year: 2018,
            },
            {
                cast: ['Leonardo DiCaprio', 'Jonah Hill', 'Margot Robbie'],
                name: 'The Wolf of Wall Street',
                rating: 0.78,
                year: 2013,
            },
        ];
        return rxjs_1.from(movies.filter(movie => movie.cast.indexOf(req.castName) > -1).map(m => new Movie(m))).pipe(Ops.tap((movie) => log(movie.toJSON())));
    }
};
__decorate([
    _1.Method({
        requestType: 'EmptyRequest',
        requestStream: false,
        responseType: 'MoviesResult',
        responseStream: false,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EmptyRequest]),
    __metadata("design:returntype", Promise)
], ExampleService.prototype, "getMovies", null);
__decorate([
    _1.Method({
        requestType: 'SearchByCastInput',
        requestStream: false,
        responseType: 'Movie',
        responseStream: true,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SearchByCastInput]),
    __metadata("design:returntype", rxjs_1.Observable)
], ExampleService.prototype, "searchMoviesByCast", null);
ExampleService = __decorate([
    _1.Service()
], ExampleService);
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const service = new ExampleService();
        log(service);
        const protoPath = yield _1.generateProto('example');
        const packageDefinition = yield proto_loader_1.load(protoPath);
        const server = new grpc_1.Server({
            'grpc.max_send_message_length': -1,
            'grpc.max_receive_message_length': -1,
        });
        server.addService(packageDefinition[service.constructor.name], _1.wrapServiceMethods(service));
        server.bind('0.0.0.0:50051', grpc_1.ServerCredentials.createInsecure());
        server.start();
        log(`grpc server for ${service.constructor.name} started`);
    });
}
main();
//# sourceMappingURL=example.js.map