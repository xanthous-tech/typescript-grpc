import { Service as ProtobufService } from 'protobufjs';

import { serviceStorage, serviceMethodConnections, methodStorage, getMethodStorageKey } from '../storage';

export function Service(options: { name?: string } = {}): ClassDecorator {
  return function serviceClassDecorator(target: Function): void {
    const serviceName = options.name || target.name;

    const protobufService = new ProtobufService(serviceName);

    if (serviceMethodConnections[serviceName] && Array.isArray(serviceMethodConnections[serviceName])) {
      serviceMethodConnections[serviceName].forEach((methodName: string) => {
        protobufService.add(methodStorage[getMethodStorageKey(serviceName, methodName)]);
      });
    }

    serviceStorage[serviceName] = protobufService;
  };
}
