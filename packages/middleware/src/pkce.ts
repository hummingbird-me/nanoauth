import { Middleware } from '@nanoauth/base';

import generateRandom64 from './util/random64';

const pkceMiddleware: Middleware = () => async (_url, next) => {
  const pkce = generateRandom64(32);
  const url = new URL(_url);
  const params = new URLSearchParams(url.search);
  params.set('code_challenge', pkce);
  params.set('code_challenge_method', 'plain');
  url.search = params.toString();

  const result = await next(url.toString());

  return { ...result, pkce };
};
export default pkceMiddleware;
