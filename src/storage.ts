import { Method, Service } from "protobufjs";

// connection lookup between services and methods
export const serviceMethodConnections: {
  [key: string]: string[];
} = {};

export const methodStorage: {
  [key: string]: Method;
} = {};

export const serviceStorage: {
  [key: string]: Service;
} = {};
