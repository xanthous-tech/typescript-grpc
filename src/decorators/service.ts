import { Service as ProtobufService } from "protobufjs";

import { serviceStorage, serviceMethodConnections, methodStorage } from "../storage";

export function Service(options: { name?: string } = {}): ClassDecorator {
  return function serviceClassDecorator(target: Function): void {
    const serviceName = options.name || target.name;

    const protobufService = new ProtobufService(serviceName);

    if (
      serviceMethodConnections[serviceName] &&
      Array.isArray(serviceMethodConnections[serviceName])
    ) {
      serviceMethodConnections[serviceName].forEach((methodName: string) => {
        protobufService.add(methodStorage[methodName]);
      });
    }

    serviceStorage[serviceName] = protobufService;
  };
}
