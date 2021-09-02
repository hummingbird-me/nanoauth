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
  for (let i = middlewares.length; i > 0; i--) {
    next = (url: string) => middlewares[i](url, next);
  }
  return next;
}
