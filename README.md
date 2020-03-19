# typescript-grpc

a minimalistic annotation-based typescript library to help build grpc servers and clients.

# Usage

```
$ yarn add typescript-grpc protobufjs grpc @grpc/proto-loader --save
```

See [src/example.ts](src/example.ts)

```typescript
import debug from 'debug';
import { Type, Field, Message } from 'protobufjs';
import { load } from '@grpc/proto-loader';
import { Server, ServiceDefinition, ServerCredentials } from 'grpc';

import { Service, Method, generateProto, wrapServiceMethods } from 'typescript-grpc';

const log = debug('typescript-grpc:example');

@Type.d()
class Movie extends Message<Movie> {
  @Field.d(1, 'string')
  name: string;

  @Field.d(2, 'int32')
  year: number;

  @Field.d(3, 'float')
  rating: number;

  @Field.d(4, 'string', 'repeated')
  cast: string[];
}

@Type.d()
class MoviesResult extends Message<MoviesResult> {
  @Field.d(1, Movie, 'repeated')
  result: Movie[];
}

@Type.d()
class EmptyRequest extends Message<EmptyRequest> {}

@Service()
class ExampleService {
  @Method({
    requestType: 'EmptyRequest',
    requestStream: false,
    responseType: 'MoviesResult',
    responseStream: false,
  })
  async getMovies(req: EmptyRequest): Promise<MoviesResult> {
    log('get movies called');
    return new MoviesResult({ result: [] });
  }
}

async function main(): Promise<void> {
  const service = new ExampleService();
  log(service);

  const protoPath = await generateProto('example');

  const packageDefinition = await load(protoPath, {
    keepCase: true,
  });

  const server = new Server({
    'grpc.max_send_message_length': -1,
    'grpc.max_receive_message_length': -1,
  });

  server.addService(packageDefinition[service.constructor.name] as ServiceDefinition<any>, wrapServiceMethods(service));
  server.bind('0.0.0.0:50051', ServerCredentials.createInsecure());
  server.start();

  log(`server started`);
}

main();

```

# Features

- Modern service method handlers via Promise and rxjs streams (TODO)
- Auto proto generation using annotations
