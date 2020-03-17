import { writeFileSync } from "fs";
import { resolve } from "path";
import { Type, Field, Message, roots } from "protobufjs";
import { main as pbjsCli } from 'protobufjs/cli/pbjs'

import { serviceStorage } from "./storage";

import { Service } from "./decorators/service";
import { Method } from "./decorators/method";

@Type.d()
class Movie extends Message<Movie> {
  @Field.d(1, "string")
  name: string;

  @Field.d(2, "int32")
  year: number;

  @Field.d(3, "float")
  rating: number;

  @Field.d(4, "string", "repeated")
  cast: string[];
}

@Type.d()
class MoviesResult extends Message<MoviesResult> {
  @Field.d(1, Movie, "repeated")
  result: Movie[];
}

@Type.d()
class EmptyRequest extends Message<EmptyRequest> {}

@Service()
class ExampleService {
  @Method({
    requestType: "EmptyRequest",
    requestStream: false,
    responseType: "MoviesResult",
    responseStream: false
  })
  async getMovies(req: EmptyRequest): Promise<MoviesResult> {
    return new MoviesResult({ result: [] });
  }
}

const service = new ExampleService();
console.log(service);

const decoratedRoot = roots["decorated"];

Object.keys(serviceStorage).forEach((serviceName: string) => {
  console.log(`adding ${serviceName}`);
  decoratedRoot.add(serviceStorage[serviceName]);
});

writeFileSync(
  resolve(process.cwd(), "example.proto.json"),
  JSON.stringify(decoratedRoot.toJSON(), null, 2)
);

pbjsCli([
  '--target',
  'proto3',
  '-o',
  'example.proto',
  'example.proto.json'
], (err, output) => {
  if (err) {
    throw err;
  }

  console.log(output);
});