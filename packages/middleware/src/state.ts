import { Middleware } from '@nanoauth/base';

export class StateMismatch extends Error {}

import generateRandom64 from './util/random64';

const stateMiddleware: Middleware = () => async (_url, next) => {
  const state = generateRandom64(32);
  const url = new URL(_url);
  const params = new URLSearchParams(url.search);
  params.set('state', state);
  url.search = params.toString();

  const result = await next(url.toString());

  if (result.state !== state)
    throw new StateMismatch('Received incorrect state from OAuth2 provider');

  return result;
};
export default stateMiddleware;
