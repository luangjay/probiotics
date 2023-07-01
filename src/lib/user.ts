export function fullName<
  T extends { prefix: string; firstName: string; lastName: string }
>(user: T) {
  const { prefix, firstName, lastName } = user;
  return `${prefix} ${firstName} ${lastName}`;
}
