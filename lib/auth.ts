export const AUTH_COOKIE = "bookhub-auth";

export function isAuthenticatedCookie(value: string | undefined): boolean {
  return value === "true";
}
