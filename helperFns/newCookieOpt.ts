export function createCookieOptions(days: number) {
  return {
    expires: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
}
