export function capitalize(str?: string) {
  return str ? str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase() : '';
}
