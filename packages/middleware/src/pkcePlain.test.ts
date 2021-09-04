import pkcePlain from './pkcePlain';

jest.mock('./util/random64');

describe('Plain PKCE middleware', () => {
  it('should add PKCE parameters to the URL without removing other params', async () => {
    const url = 'https://example.com/oauth2.html?foo=bar';
    const middleware = pkcePlain();

    await middleware(url, async (url) => {
      const parsedUrl = new URL(url);
      const params = new URLSearchParams(parsedUrl.search);
      expect(params.has('code_challenge')).toBeTruthy();
      expect(params.get('code_challenge_method')).toBe('plain');
      return {};
    });
  });

  it('should return the generated code verifier in the parameters', async () => {
    const url = 'https://example.com/oauth2.html';
    const middleware = pkcePlain();

    let codeChallenge = '';

    const result = await middleware(url, async (url) => {
      const parsedUrl = new URL(url);
      const params = new URLSearchParams(parsedUrl.search);
      codeChallenge = params.get('code_challenge') as string;
      expect(params.get('code_challenge_method')).toBe('plain');
      return {};
    });

    expect(codeChallenge).toEqual(result.codeVerifier);
  });
});
