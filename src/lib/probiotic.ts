export function species(name: string) {
  return name.split(";").at(-1) ?? "none";
}

export function genus(name: string) {
  return name.split(";").at(-2) ?? "none";
}
