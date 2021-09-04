import { Middleware } from '@nanoauth/base';

import generateRandom64 from './util/random64';
import encodeBytes64 from './util/encodeBytes64';

const pkceS256Middleware: Middleware = () => async (_url, next) => {
  const url = new URL(_url);
  const params = new URLSearchParams(url.search);

  // Generate our verifier and challenge
  const codeVerifier = generateRandom64(32);
  const codeVerifierBytes = new TextEncoder().encode(codeVerifier);
  const codeChallengeBytes = await crypto.subtle.digest(
    'SHA-256',
    codeVerifierBytes
  );
  const codeChallenge = encodeBytes64(new Uint8Array(codeChallengeBytes));

  params.set('code_challenge', codeChallenge);
  params.set('code_challenge_method', 'S256');
  url.search = params.toString();

  const result = await next(url.toString());

  return { ...result, codeVerifier };
};

export default pkceS256Middleware;
