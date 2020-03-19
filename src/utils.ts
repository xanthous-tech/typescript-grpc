export function getFilename(name: string): string {
  if (name.endsWith('.proto')) {
    return name;
  } else {
    return name + '.proto';
  }
}
