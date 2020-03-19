import debug from 'debug';
import { Type, Field, Message } from 'protobufjs';
import { load } from '@grpc/proto-loader';
import { Server, ServiceDefinition, ServerCredentials } from 'grpc';
import { Observable, from } from 'rxjs';
import * as Ops from 'rxjs/operators';

import { Service, Method, generateProto, wrapServiceMethods } from '.';

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

@Type.d()
class SearchByCastInput extends Message<SearchByCastInput> {
  @Field.d(1, 'string')
  castName: string;
}

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

  @Method({
    requestType: 'SearchByCastInput',
    requestStream: false,
    responseType: 'Movie',
    responseStream: true,
  })
  searchMoviesByCast(req: SearchByCastInput): Observable<Movie> {
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

    return from(movies.filter(movie => movie.cast.indexOf(req.castName) > -1).map(m => new Movie(m))).pipe(
      Ops.tap((movie: Movie) => log(movie.toJSON())),
    );
  }
}

async function main(): Promise<void> {
  const service = new ExampleService();
  log(service);

  const protoPath = await generateProto('example');

  const packageDefinition = await load(protoPath);

  const server = new Server({
    'grpc.max_send_message_length': -1,
    'grpc.max_receive_message_length': -1,
  });

  server.addService(packageDefinition[service.constructor.name] as ServiceDefinition<any>, wrapServiceMethods(service));
  server.bind('0.0.0.0:50051', ServerCredentials.createInsecure());
  server.start();

  log(`grpc server for ${service.constructor.name} started`);
}

main();
