import { Middleware } from '@nanoauth/base';

import generateRandom64 from './util/random64';

const pkcePlainMiddleware: Middleware = () => async (_url, next) => {
  const codeVerifier = generateRandom64(32);
  const url = new URL(_url);
  const params = new URLSearchParams(url.search);
  params.set('code_challenge', codeVerifier);
  params.set('code_challenge_method', 'plain');
  url.search = params.toString();

  const result = await next(url.toString());

  return { ...result, codeVerifier };
};

export default pkcePlainMiddleware;
