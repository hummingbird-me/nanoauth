import { getAuthorization, OAuth2Response } from '@nanoauth/base';
import { pkcePlain, state } from '@nanoauth/middleware';

export default async function getMyAnimeListAuthorization({
  clientId,
  redirectUri,
}: {
  clientId: string;
  redirectUri: string;
}): Promise<OAuth2Response> {
  const params = new URLSearchParams({
    response_type: 'code',
    redirect_uri: redirectUri,
    client_id: clientId,
  });
  const url = new URL('https://myanimelist.net/v1/oauth2/authorize');
  url.search = params.toString();

  return getAuthorization({
    url: url.toString(),
    middlewares: [pkcePlain(), state()],
  });
}
