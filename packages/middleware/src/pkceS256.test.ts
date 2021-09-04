import pkceS256 from './pkceS256';

jest.mock('./util/random64');

import { TextEncoder } from 'util';
import { Crypto } from '@peculiar/webcrypto';
global.TextEncoder = TextEncoder;
global.crypto = new Crypto();

describe('S256 PKCE middleware', () => {
  it('should add PKCE parameters to the URL without removing other params', async () => {
    const url = 'https://example.com/oauth2.html?foo=bar';
    const middleware = pkceS256();

    await middleware(url, async (url) => {
      const parsedUrl = new URL(url);
      const params = new URLSearchParams(parsedUrl.search);
      expect(params.has('code_challenge')).toBeTruthy();
      expect(params.get('code_challenge_method')).toBe('S256');
      return {};
    });
  });

  it('should return the generated code verifier in the parameters', async () => {
    const url = 'https://example.com/oauth2.html';
    const middleware = pkceS256();

    let codeChallenge = '';

    const result = await middleware(url, async (url) => {
      const parsedUrl = new URL(url);
      const params = new URLSearchParams(parsedUrl.search);
      codeChallenge = params.get('code_challenge') as string;
      expect(params.get('code_challenge_method')).toBe('S256');
      return {};
    });

    expect(codeChallenge).toEqual(
      '2FzmRL9Ogs7gMuqlw9kDCgkCdtm643AxEr38b4_d4wc'
    );
    expect(result.codeVerifier).toEqual(
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
    );
  });
});
