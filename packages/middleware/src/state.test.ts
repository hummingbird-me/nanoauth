import stateMiddleware, { StateMismatch } from './state';

jest.mock('./util/random64');

describe('state middleware', () => {
  it('should add a state parameter to the URL without removing other params', async () => {
    const url = 'https://example.com/oauth2.html?foo=bar';
    const middleware = stateMiddleware();

    await middleware(url, async (url) => {
      const parsedUrl = new URL(url);
      const params = new URLSearchParams(parsedUrl.search);
      expect(params.has('state')).toBeTruthy();
      expect(params.get('foo')).toBe('bar');
      return { state: params.get('state') as string };
    });
  });

  it('should raise a StateMismatch when the state differs', async () => {
    const url = 'https://example.com/oauth2.html?foo=bar';
    const middleware = stateMiddleware();

    await expect(
      middleware(url, async (url) => {
        const parsedUrl = new URL(url);
        const params = new URLSearchParams(parsedUrl.search);
        expect(params.has('state')).toBeTruthy();
        return { state: 'WRONG' };
      })
    ).rejects.toThrow(StateMismatch);
  });
});
