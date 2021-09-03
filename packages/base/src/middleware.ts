export type OAuth2Response = Record<string, string>;
export type MiddlewareInstance = (
  url: string,
  next: (url: string) => Promise<OAuth2Response>
) => Promise<OAuth2Response>;
export type Middleware<C = Record<string, never>> = (
  config?: C
) => MiddlewareInstance;

export function applyMiddleware(
  middlewares: MiddlewareInstance[],
  then: (url: string) => Promise<OAuth2Response>
): (url: string) => Promise<OAuth2Response> {
  let next = (url: string) => then(url);
  for (let i = middlewares.length - 1; i >= 0; i--) {
    const _next = next;
    next = (url: string) => middlewares[i](url, _next);
  }
  return next;
}
