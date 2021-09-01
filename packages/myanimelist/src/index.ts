import { generateRandom64, getAuthorization } from '@nanoauth/base';

export default async function getMyAnimeListAuthorization({
  clientId,
  redirectUri,
}: {
  clientId: string;
  redirectUri: string;
}): Promise<Record<string, unknown>> {
  const pkce = generateRandom64(32);
  const state = generateRandom64(32);
  const params = new URLSearchParams({
    response_type: 'code',
    redirect_uri: redirectUri,
    client_id: clientId,
    code_challenge: pkce,
    code_challenge_method: 'plain',
    state,
  });
  const url = new URL('https://myanimelist.net/v1/oauth2/authorize');
  url.search = params.toString();
  console.log(url.toString());
  const result = await getAuthorization(url);

  return {};
}
