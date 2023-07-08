export function alias(name: string) {
  return name.split(";").at(-1) ?? "";
}
